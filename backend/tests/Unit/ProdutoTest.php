<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProdutoTest extends TestCase
{
    use RefreshDatabase;

    public function test_produto_is_low_stock()
    {
        $produto1 = Produto::factory()->make(['estoque' => 3]);
        $produto2 = Produto::factory()->make(['estoque' => 10]);
        
        $this->assertTrue($produto1->isLowStock());
        $this->assertFalse($produto2->isLowStock());
    }
}