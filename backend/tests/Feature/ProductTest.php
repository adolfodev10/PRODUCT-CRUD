<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_pode_listar_seus_produtos()
    {
        $user = User::factory()->create();
        Produto::factory()->count(3)->create(['cliente_id' => $user->id]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/produtos');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function usuario_pode_criar_um_produto()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/produtos', [
            'nome' => 'Notebook Dell',
            'descricao' => 'Notebook top de linha',
            'preco' => 3499.90,
            'estoque' => 15,
            'categoria' => 'Eletrônicos'
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'nome' => 'Notebook Dell',
                     'preco' => 3499.90,
                     'estoque' => 15
                 ]);
        
        $this->assertDatabaseHas('produtos', [
            'nome' => 'Notebook Dell',
            'cliente_id' => $user->id
        ]);
    }

    /** @test */
    public function nao_pode_criar_produto_sem_nome()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/produtos', [
            'preco' => 99.90,
            'estoque' => 10
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['nome']);
    }

    /** @test */
    public function nao_pode_criar_produto_com_preco_negativo()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/produtos', [
            'nome' => 'Produto Teste',
            'preco' => -10.00,
            'estoque' => 5
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['preco']);
    }

    /** @test */
    public function usuario_pode_ver_um_produto_especifico()
    {
        $user = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/produtos/{$produto->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $produto->id,
                     'nome' => $produto->nome
                 ]);
    }

    /** @test */
    public function usuario_nao_pode_ver_produto_de_outro_usuario()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user2->id]);
        
        Sanctum::actingAs($user1);

        $response = $this->getJson("/api/produtos/{$produto->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function usuario_pode_atualizar_seu_produto()
    {
        $user = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/produtos/{$produto->id}", [
            'nome' => 'Nome Atualizado',
            'preco' => 199.99,
            'estoque' => 20
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('produtos', [
            'id' => $produto->id,
            'nome' => 'Nome Atualizado',
            'preco' => 199.99
        ]);
    }

    /** @test */
    public function usuario_pode_deletar_seu_produto()
    {
        $user = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/produtos/{$produto->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('produtos', ['id' => $produto->id]);
    }

    /** @test */
    public function usuario_nao_pode_deletar_produto_de_outro()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user2->id]);
        
        Sanctum::actingAs($user1);

        $response = $this->deleteJson("/api/produtos/{$produto->id}");

        $response->assertStatus(404);
    }
}