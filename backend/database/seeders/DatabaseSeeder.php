<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\Produto;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Criar admin
        $admin = Cliente::create([
            'nome' => 'Administrador',
            'email' => 'admin@exemplo.com',
            'password' => Hash::make('admin123'),
            'is_admin' => true
        ]);

        // Criar clientes normais
        $clientes = [];
        for ($i = 1; $i <= 5; $i++) {
            $clientes[] = Cliente::create([
                'nome' => "Cliente $i",
                'email' => "cliente$i@exemplo.com",
                'password' => Hash::make('123456'),
                'is_admin' => false
            ]);
        }

        // Criar produtos para cada cliente
        foreach ($clientes as $cliente) {
            for ($j = 1; $j <= 3; $j++) {
                Produto::create([
                    'cliente_id' => $cliente->id,
                    'nome' => "Produto {$j} de {$cliente->nome}",
                    'descricao' => "Descrição do produto {$j}",
                    'preco' => rand(10, 500) + 0.99,
                    'estoque' => rand(0, 100),
                    'categoria' => ['Eletrônicos', 'Roupas', 'Livros'][rand(0, 2)]
                ]);
            }
        }
    }
}