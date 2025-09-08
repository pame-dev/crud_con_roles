<?php

namespace App\Http\Controllers;

use App\Models\Empleado;


class EmpleadoController extends Controller
{
    public function index()
    {
        return response()->json(Empleado::all());
    }

    public function show($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }
        return response()->json($empleado);
    }
}
