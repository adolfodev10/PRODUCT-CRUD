<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Product CRUD API',
                'description' => 'API para gerenciamento de produtos - Microserviço',
                'version' => '1.0.0',
            ],
            'routes' => [
                'api' => 'api/documentation',
            ],
            'paths' => [
                'docs' => storage_path('api-docs'),
                'annotations' => base_path('app'),
                'swagger_ui' => base_path('vendor/swagger-api/swagger-ui/dist'),
            ],
        ],
    ],
    'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
    'proxy' => false,
    'verbs' => ['GET', 'POST', 'PUT', 'DELETE'],
];