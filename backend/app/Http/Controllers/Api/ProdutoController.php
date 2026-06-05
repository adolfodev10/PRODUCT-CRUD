<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProdutoController extends Controller
{
    public function index(Request $request)
    {
        $produtos = $request->user()->produtos()->paginate(15);
        
        return response()->json([
            'data' => $produtos->items(),
            'meta' => [
                'current_page' => $produtos->currentPage(),
                'last_page' => $produtos->lastPage(),
                'per_page' => $produtos->perPage(),
                'total' => $produtos->total()
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Arrumei a validação depois que percebi que preco podia ser negativo
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0|max:999999.99',
            'estoque' => 'required|integer|min:0',
            'categoria' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $produto = $request->user()->produtos()->create($request->all());

        return response()->json($produto, 201);
    }

    public function show(Request $request, $id)
    {
        $produto = $request->user()->produtos()->find($id);
        
        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }

        return response()->json($produto);
    }

    public function update(Request $request, $id)
    {
        $produto = $request->user()->produtos()->find($id);
        
        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'sometimes|numeric|min:0|max:999999.99',
            'estoque' => 'sometimes|integer|min:0',
            'categoria' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $produto->update($request->all());

        return response()->json($produto);
    }

    public function destroy(Request $request, $id)
    {
        $produto = $request->user()->produtos()->find($id);
        
        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }

        // TODO: adicionar soft delete depois
        $produto->delete();

        return response()->json(['message' => 'Produto removido com sucesso']);
    }
}