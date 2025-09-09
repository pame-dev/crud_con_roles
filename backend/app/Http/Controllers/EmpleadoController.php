<?php

namespace App\Http\Controllers;
use App\Models\Empleado;
use Illuminate\Http\Request; // ← Esto importa correctamente Request

// Controlador que maneja las operaciones CRUD básicas de empleados.
// Permite obtener todos los empleados, uno por ID o filtrarlos por cargo.

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

    public function porCargo($cargo)
    {
    // Buscar todos los empleados cuyo cargo coincida
    $empleados = Empleado::where('CARGO', $cargo)->get();

    if ($empleados->isEmpty()) {
        return response()->json(['error' => 'No se encontraron empleados con ese cargo'], 404);
    }

    return response()->json($empleados);
    }
// Nuevo método para crear un empleado
    public function store(Request $request)
{
    $empleado = Empleado::create([
        'NOMBRE'     => $request->nombre,
        'CORREO'     => $request->correo,
        'CARGO'      => $request->cargo,
        'CONTRASENA' => $request->contrasena,
        'ID_ROL'     => $request->id_rol,
    ]);

    return response()->json([
        'message' => 'Empleado registrado correctamente',
        'empleado' => $empleado
    ], 201);
}


}
