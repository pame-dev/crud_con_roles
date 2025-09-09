<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Definición de rutas API para la aplicación.
// Incluye rutas protegidas y rutas públicas con CORS para empleados y login.

// Ruta protegida con auth
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API con CORS
Route::middleware([CorsMiddleware::class])->group(function () {
    Route::get('/empleados', [EmpleadoController::class, 'index']);
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    Route::get('/empleados/cargo/{cargo}', [EmpleadoController::class, 'porCargo']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/empleados', [EmpleadoController::class, 'store']); // Ruta para crear empleados
});