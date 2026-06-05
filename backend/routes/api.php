<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdutoController;
use App\Http\Controllers\Api\AdminController;

// Rotas publicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Produtos CRUD
    Route::apiResource('produtos', ProdutoController::class);
    
    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/clientes/count', [AdminController::class, 'getClientesCount']);
        Route::get('/clientes', [AdminController::class, 'getAllClientes']);
    });
});