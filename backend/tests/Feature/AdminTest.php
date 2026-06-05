<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Cliente;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_ve_quantidade_clientes()
    {
        $admin = Cliente::factory()->create(['is_admin' => true]);
        Cliente::factory()->count(5)->create();
        
        Sanctum::actingAs($admin);
        
        $response = $this->getJson('/api/admin/clientes/count');
        
        $response->assertStatus(200);
        $response->assertJson([
            'total_clientes' => 6
        ]);
    }

    public function test_cliente_normal_nao_pode_ver_quantidade()
    {
        $cliente = Cliente::factory()->create(['is_admin' => false]);
        
        Sanctum::actingAs($cliente);
        
        $response = $this->getJson('/api/admin/clientes/count');
        
        $response->assertStatus(403);
    }
}