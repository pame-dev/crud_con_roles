<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

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
        $empleados = Empleado::where('CARGO', $cargo)->get();

        if ($empleados->isEmpty()) {
            return response()->json(['error' => 'No se encontraron empleados con ese cargo'], 404);
        }

        return response()->json($empleados);
    }

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

    // NUEVO MÉTODO: todos los trabajadores con sus turnos en 'en_atencion'
    public function trabajadoresConTurno()
    {
        $trabajadores = Empleado::where('ID_ROL', 2) // 👈 Filtrar solo rol 2
            ->with(['turnos' => function($q) {
                $q->where('ESTATUS', 'en_atencion');
            }])
            ->get();
        
        return response()->json($trabajadores);
    }

    // NUEVO MÉTODO: eliminar empleado
    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }
        // Eliminar turnos asociados antes de eliminar el empleado
        $empleado->turnos()->delete();

        $empleado->delete();
        return response()->json(['message' => 'Empleado eliminado correctamente']);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        $empleado->update([
            'NOMBRE'     => $request->nombre,
            'CORREO'     => $request->correo,
            'CARGO'      => $request->cargo,
            'ID_ROL'     => $request->id_rol,
        ]);

        return response()->json([
            'message' => 'Empleado actualizado correctamente',
            'empleado' => $empleado
        ]);
    }
}