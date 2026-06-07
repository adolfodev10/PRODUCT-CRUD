<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function rotas_protegidas_requerem_autenticacao()
    {
        $rotas = [
            'get' => ['/api/produtos'],
            'post' => ['/api/produtos'],
            'put' => ['/api/produtos/1'],
            'delete' => ['/api/produtos/1']
        ];

        foreach ($rotas['get'] as $rota) {
            $response = $this->getJson($rota);
            $response->assertStatus(401);
        }

        foreach ($rotas['post'] as $rota) {
            $response = $this->postJson($rota);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function endpoint_produtos_retorna_paginacao()
    {
        $user = User::factory()->create();
        Produto::factory()->count(15)->create(['cliente_id' => $user->id]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/produtos?page=2');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data',
                     'current_page',
                     'last_page',
                     'per_page',
                     'total'
                 ]);
    }

    /** @test */
    public function endpoint_produtos_aceita_busca_por_categoria()
    {
        $user = User::factory()->create();
        Produto::factory()->create([
            'cliente_id' => $user->id,
            'categoria' => 'Eletrônicos'
        ]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/produtos?categoria=Eletrônicos');

        $response->assertStatus(200);
    }

    /** @test */
    public function resposta_do_endpoint_produtos_tem_formato_correto()
    {
        $user = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user->id]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/produtos/{$produto->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id',
                     'nome',
                     'descricao',
                     'preco',
                     'estoque',
                     'categoria',
                     'created_at',
                     'updated_at'
                 ]);
    }
}