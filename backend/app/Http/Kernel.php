protected $routeMiddleware = [
    // ... outros middlewares
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
];