<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_cliente_pode_se_registrar()
    {
        $response = $this->postJson('/api/register', [
            'nome' => 'Novo Cliente',
            'email' => 'novo@exemplo.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('clientes', ['email' => 'novo@exemplo.com']);
        $response->assertJsonStructure(['cliente', 'token']);
    }

    public function test_cliente_pode_logar()
    {
        $cliente = Cliente::factory()->create([
            'email' => 'teste@exemplo.com',
            'password' => Hash::make('senha123')
        ]);
        
        $response = $this->postJson('/api/login', [
            'email' => 'teste@exemplo.com',
            'password' => 'senha123'
        ]);
        
        $response->assertStatus(200);
        $response->assertJsonStructure(['cliente', 'token']);
    }

    public function test_nao_pode_logar_com_senha_errada()
    {
        $cliente = Cliente::factory()->create([
            'email' => 'teste@exemplo.com'
        ]);
        
        $response = $this->postJson('/api/login', [
            'email' => 'teste@exemplo.com',
            'password' => 'senha_errada'
        ]);
        
        $response->assertStatus(422);
    }
}