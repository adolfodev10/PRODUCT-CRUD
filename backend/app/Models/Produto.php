<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id', 'nome', 'descricao', 'preco', 'estoque', 'categoria'
    ];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }
}
