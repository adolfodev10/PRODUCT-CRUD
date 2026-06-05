<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $table = 'produtos';
    
    protected $fillable = [
        'cliente_id',
        'nome',
        'descricao',
        'preco',
        'estoque',
        'categoria'
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'estoque' => 'integer'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    // Método auxiliar que esqueci de colocar no primeiro commit
    public function isLowStock()
    {
        return $this->estoque < 5;
    }
}