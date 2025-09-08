<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpleadoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/empleados', [EmpleadoController::class, 'index']);
Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
Route::get('/empleados/cargo/{cargo}', [EmpleadoController::class, 'porCargo']);
