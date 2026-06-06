<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index(Request $request)
    {
        $produtos = $request->user()->produtos()->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($produtos);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'descricao' => 'nullable|string',
                'preco' => 'required|numeric|min:0',
                'estoque' => 'required|integer|min:0',
                'categoria' => 'nullable|string|max:100'
            ]);

            $produto = new Produto();
            $produto->cliente_id = $request->user()->id;
            $produto->nome = $validated['nome'];
            $produto->descricao = $validated['descricao'] ?? null;
            $produto->preco = $validated['preco'];
            $produto->estoque = $validated['estoque'];
            $produto->categoria = $validated['categoria'] ?? null;
            $produto->save();

            return response()->json($produto, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $produto = $request->user()->produtos()->findOrFail($id);
        return response()->json($produto);
    }

    public function update(Request $request, $id)
    {
        $produto = $request->user()->produtos()->findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'sometimes|numeric|min:0',
            'estoque' => 'sometimes|integer|min:0',
            'categoria' => 'nullable|string|max:100'
        ]);
        
        $produto->update($validated);
        return response()->json($produto);
    }

    public function destroy(Request $request, $id)
    {
        $produto = $request->user()->produtos()->findOrFail($id);
        $produto->delete();
        return response()->json(['message' => 'Produto deletado com sucesso']);
    }
}
