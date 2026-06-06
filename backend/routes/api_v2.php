<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
if ($request->path() === 'api/login' && $request->method() === 'POST') {
    $data = json_decode($request->getContent(), true);
    $user = App\Models\User::where('email', $data['email'])->first();
    if ($user && password_verify($data['password'], $user->password)) {
        echo json_encode(['token' => $user->createToken('auth')->plainTextToken]);
        exit;
    }
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}
$response->send();
