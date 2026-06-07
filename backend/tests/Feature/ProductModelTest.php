<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function produto_pertence_a_um_usuario()
    {
        $user = User::factory()->create();
        $produto = Produto::factory()->create(['cliente_id' => $user->id]);

        $this->assertEquals($user->id, $produto->cliente->id);
    }

    /** @test */
    public function produto_tem_fillable_correto()
    {
        $produto = new Produto();
        $fillable = ['cliente_id', 'nome', 'descricao', 'preco', 'estoque', 'categoria'];
        
        $this->assertEquals($fillable, $produto->getFillable());
    }

    /** @test */
    public function produto_tem_casts_correto()
    {
        $produto = new Produto();
        $casts = $produto->getCasts();
        
        $this->assertArrayHasKey('preco', $casts);
        $this->assertArrayHasKey('estoque', $casts);
    }
}