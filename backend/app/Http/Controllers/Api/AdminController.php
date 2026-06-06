<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Produto;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getClientesCount(Request $request)
    {
        // Verifica se é admin
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Acesso negado. Área administrativa.'], 403);
        }

        $totalClientes = User::count();
        $totalProdutos = Produto::count();
        $clientesComProdutos = User::has('produtos')->count();

        return response()->json([
            'total_clientes' => $totalClientes,
            'total_produtos' => $totalProdutos,
            'clientes_com_produtos' => $clientesComProdutos,
            'data_consulta' => now()->format('d/m/Y H:i:s')
        ]);
    }

    public function getAllClientes(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Acesso negado. Área administrativa.'], 403);
        }

        $clientes = User::withCount('produtos')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json([
            'data' => $clientes,
            'total' => $clientes->count()
        ]);
    }
}