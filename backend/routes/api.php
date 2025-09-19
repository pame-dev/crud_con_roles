<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TurnController;

// Definición de rutas API para la aplicación.
// Incluye rutas protegidas y rutas públicas con CORS para empleados y login.

// Ruta protegida con auth
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API con CORS
Route::middleware([CorsMiddleware::class])->group(function () {
    Route::get('/empleados', [EmpleadoController::class, 'index']);
    Route::post('/empleados/correo-existe', [EmpleadoController::class, 'correoExiste']);
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    Route::get('/empleados/cargo/{cargo}', [EmpleadoController::class, 'porCargo']);
    Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);
    Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);
    Route::post('/turnos', [TurnController::class, 'store']);
    Route::get('/turnos/ultimo', [TurnController::class, 'ultimo']);
    Route::get('/turnos/historial', [TurnController::class, 'historial']);
    Route::get('/turnos/en_atencion', [TurnController::class, 'enAtencion']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/empleados', [EmpleadoController::class, 'store']); // Ruta para crear empleados
    Route::get('/trabajadores/con-turno', [EmpleadoController::class, 'trabajadoresConTurno']);
    Route::get('/turnos/fila', [TurnController::class, 'filaActual']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-code', [AuthController::class, 'verifyCode']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/turnos/pasar', [TurnController::class, 'pasarTurno']);
    Route::delete('/turnos/{id}', [TurnController::class, 'destroy']); // ruta para eliminar turnos
    Route::post('/empleados/correo-existe', [EmpleadoController::class, 'correoExiste']);

});