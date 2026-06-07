<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});Route::get('/teste', fn() => 'Funciona');

Route::post('/api/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/api/register', [App\Http\Controllers\Api\AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/api/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
    Route::post('/api/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/api/produtos', [App\Http\Controllers\Api\ProdutoController::class, 'index']);
    Route::post('/api/produtos', [App\Http\Controllers\Api\ProdutoController::class, 'store']);
    Route::get('/api/produtos/{id}', [App\Http\Controllers\Api\ProdutoController::class, 'show']);
    Route::put('/api/produtos/{id}', [App\Http\Controllers\Api\ProdutoController::class, 'update']);
    Route::delete('/api/produtos/{id}', [App\Http\Controllers\Api\ProdutoController::class, 'destroy']);
    
    Route::get('/api/admin/clientes/count', [App\Http\Controllers\Api\AdminController::class, 'getClientesCount']);
    Route::get('/api/admin/clientes', [App\Http\Controllers\Api\AdminController::class, 'getAllClientes']);
});
