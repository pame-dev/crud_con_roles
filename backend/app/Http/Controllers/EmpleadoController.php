<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        return response()->json(Empleado::where('ACTIVO', 1)->get()); // Filtra empleados activos
    }

    public function show($id)
    {
        $empleado = Empleado::where('ID_EMPLEADO', $id)->where('ACTIVO', 1)->first();
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

    
    // MÉTODO ACTUALIZADO: trabajadores con turno INCLUYENDO estado
    public function trabajadoresConTurno()
    {
        $trabajadores = Empleado::where('ID_ROL', 2) // 👈 Filtrar solo rol 2
            ->with(['turnos' => function($q) {
                $q->where('ESTATUS', 'en_atencion');
            }])
            ->get()
            ->map(function($emp) {
                return [
                    'ID_EMPLEADO' => $emp->ID_EMPLEADO,
                    'NOMBRE' => $emp->NOMBRE,
                    'APELLIDOS' => $emp->APELLIDOS,
                    'CARGO' => $emp->CARGO,
                    'ESTADO' => $emp->ESTADO, // ← AÑADE ESTA LÍNEA
                    'turnos' => $emp->turnos // ← Los turnos se mantienen
                ];
            });
        
        return response()->json($trabajadores);
    }

    // NUEVO MÉTODO: eliminar/desactivar empleado
    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }
        $empleado->ACTIVO = 0; // Marcar como inactivo en lugar de eliminar
        $empleado->save();

        return response()->json(['message' => 'Empleado desactivado correctamente']);
    }

    public function recuperar($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }
        $empleado->ACTIVO = 1; // Marcar como activo
        $empleado->save();

        return response()->json(['message' => 'Empleado recuperado correctamente']);
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
            'ESTADO'     => $request->estado,
        ]);

        return response()->json([
            'message' => 'Empleado actualizado correctamente',
            'empleado' => $empleado
        ]);
    }

    // Verificar si el correo ya existe (excluyendo el empleado actual)
    public function correoExiste(Request $request)
    {
        $correo = $request->correo;
        $id = $request->id;
        $existe = Empleado::where('CORREO', $correo)
            ->where('ID_EMPLEADO', '!=', $id)
            ->exists();
        return response()->json(['existe' => $existe]);
    }

    public function ausentes()
        {
            $ausentes = Empleado::where('ESTADO', 0)->get();
            return response()->json($ausentes);
        }

    // NUEVO MÉTODO: Actualizar estado de empleado (ausente/presente)
    public function actualizarEstado($id, Request $request)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        $validated = $request->validate([
            'estado' => 'required|boolean'
        ]);

        $empleado->ESTADO = $validated['estado'];
        $empleado->save();

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'empleado' => $empleado
        ]);
    }
}