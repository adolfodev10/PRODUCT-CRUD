<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Cliente;
use App\Models\Produto;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_cliente_pode_cadastrar_seu_produto()
    {
        $cliente = Cliente::factory()->create();
        Sanctum::actingAs($cliente);
        
        $response = $this->postJson('/api/produtos', [
            'nome' => 'Notebook Dell',
            'descricao' => 'Notebook top de linha',
            'preco' => 3499.90,
            'estoque' => 15,
            'categoria' => 'Eletrônicos'
        ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('produtos', [
            'cliente_id' => $cliente->id,
            'nome' => 'Notebook Dell',
            'preco' => 3499.90
        ]);
    }

    public function test_nao_pode_cadastrar_produto_com_preco_negativo()
    {
        $cliente = Cliente::factory()->create();
        Sanctum::actingAs($cliente);
        
        $response = $this->postJson('/api/produtos', [
            'nome' => 'Produto Invalido',
            'preco' => -10.00,
            'estoque' => 5
        ]);
        
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['preco']);
    }

    public function test_cliente_so_ve_seus_produtos()
    {
        $cliente1 = Cliente::factory()->create();
        $cliente2 = Cliente::factory()->create();
        
        Produto::factory()->count(3)->create(['cliente_id' => $cliente1->id]);
        Produto::factory()->count(2)->create(['cliente_id' => $cliente2->id]);
        
        Sanctum::actingAs($cliente1);
        
        $response = $this->getJson('/api/produtos');
        
        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_cliente_pode_atualizar_seu_produto()
    {
        $cliente = Cliente::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $cliente->id]);
        
        Sanctum::actingAs($cliente);
        
        $response = $this->putJson("/api/produtos/{$produto->id}", [
            'nome' => 'Nome Atualizado',
            'preco' => 199.99
        ]);
        
        $response->assertStatus(200);
        $this->assertDatabaseHas('produtos', [
            'id' => $produto->id,
            'nome' => 'Nome Atualizado',
            'preco' => 199.99
        ]);
    }

    public function test_cliente_nao_pode_atualizar_produto_de_outro()
    {
        $cliente1 = Cliente::factory()->create();
        $cliente2 = Cliente::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $cliente2->id]);
        
        Sanctum::actingAs($cliente1);
        
        $response = $this->putJson("/api/produtos/{$produto->id}", [
            'nome' => 'Tentativa de Hack'
        ]);
        
        $response->assertStatus(404);
    }

    public function test_cliente_pode_apagar_seu_produto()
    {
        $cliente = Cliente::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $cliente->id]);
        
        Sanctum::actingAs($cliente);
        
        $response = $this->deleteJson("/api/produtos/{$produto->id}");
        
        $response->assertStatus(200);
        $this->assertDatabaseMissing('produtos', ['id' => $produto->id]);
    }
}