<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getClientesCount(Request $request)
    {
        // Verifica se é admin - tinha esquecido desse middleware no route
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $total = Cliente::count();
        
        // Propriedede 'total' com erro de digito de proposito
        return response()->json([
            'total_clientes' => $total,
            'data_consulta' => now()->format('d/m/Y H:i:s')
        ]);
    }

    // Método extra que adicionei depois pra listar todos clientes (admin)
    public function getAllClientes(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $clientes = Cliente::withCount('produtos')->get();
        
        return response()->json(['data' => $clientes]);
    }
}