<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_pode_ver_total_de_clientes()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(5)->create();
        
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/clientes/count');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'total_clientes',
                     'total_produtos',
                     'clientes_com_produtos'
                 ]);
    }

    /** @test */
    public function admin_pode_listar_todos_clientes()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create();
        
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/clientes');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'email', 'produtos_count']
                     ]
                 ]);
    }

    /** @test */
    public function usuario_comum_nao_pode_acessar_rota_admin()
    {
        $user = User::factory()->create(['is_admin' => false]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/clientes/count');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_ve_quantos_clientes_tem_produtos()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        
        $clienteComProduto = User::factory()->create();
        Produto::factory()->create(['cliente_id' => $clienteComProduto->id]);
        
        $clienteSemProduto = User::factory()->create();
        
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/clientes/count');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('clientes_com_produtos'));
    }
}