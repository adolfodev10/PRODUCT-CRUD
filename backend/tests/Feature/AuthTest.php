<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function um_usuario_pode_se_registrar()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'João Silva',
            'email' => 'joao@exemplo.com',
            'password' => '12345678',
            'password_confirmation' => '12345678'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token'
                 ]);
        
        $this->assertDatabaseHas('users', [
            'email' => 'joao@exemplo.com'
        ]);
    }

    /** @test */
    public function um_usuario_pode_fazer_login()
    {
        $user = User::factory()->create([
            'email' => 'login@teste.com',
            'password' => bcrypt('12345678')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@teste.com',
            'password' => '12345678'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user',
                     'token'
                 ]);
    }

    /** @test */
    public function nao_consegue_logar_com_senha_errada()
    {
        $user = User::factory()->create([
            'email' => 'login@teste.com',
            'password' => bcrypt('12345678')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@teste.com',
            'password' => 'senha_errada'
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function usuario_pode_fazer_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/logout');

        $response->assertStatus(200);
        $this->assertCount(0, $user->tokens);
    }

    /** @test */
    public function usuario_pode_ver_seus_dados()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $user->id,
                     'name' => $user->name,
                     'email' => $user->email
                 ]);
    }
}