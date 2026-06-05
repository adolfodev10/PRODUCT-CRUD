<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     title="Product CRUD API",
 *     version="1.0.0",
 *     description="API para gerenciamento de produtos - Cada cliente gerencia seus proprios produtos",
 *     @OA\Contact(
 *         email="suporte@productcrud.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Servidor Local"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Sanctum"
 * )
 */
class SwaggerController extends Controller
{
    // Este controller serve apenas para as anotações do Swagger
}