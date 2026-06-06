<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdutoController;

Route::get('/', function () {
    return view('welcome');
});

// Rotas da API
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/api/me', [AuthController::class, 'me']);
    Route::post('/api/logout', [AuthController::class, 'logout']);
    
    // Rotas de produtos
    Route::get('/api/produtos', [ProdutoController::class, 'index']);
    Route::post('/api/produtos', [ProdutoController::class, 'store']);
    Route::get('/api/produtos/{id}', [ProdutoController::class, 'show']);
    Route::put('/api/produtos/{id}', [ProdutoController::class, 'update']);
    Route::delete('/api/produtos/{id}', [ProdutoController::class, 'destroy']);


    // Rotas exclusivas para admin
    Route::middleware('admin')->group(function () {
        Route::get('/api/admin/clientes/count', [AdminController::class, 'getClientesCount']);
        Route::get('/api/admin/clientes', [AdminController::class, 'getAllClientes']);
    });
    });