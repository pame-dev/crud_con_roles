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
    public function trabajadoresConTurno(Request $request)
    {
        $query = Empleado::where('ID_ROL', 2) // solo trabajadores
            ->with(['turnos' => function($q) {
                $q->where('ESTATUS', 'en_atencion');
            }]);

        // Si envían cargo, filtramos por el cargo del gerente
        if ($request->has('cargo') && $request->cargo) {
            $query->where('CARGO', $request->cargo);
        }

        $trabajadores = $query->get()->map(function($emp) {
            return [
                'ID_EMPLEADO' => $emp->ID_EMPLEADO,
                'NOMBRE' => $emp->NOMBRE,
                'APELLIDOS' => $emp->APELLIDOS,
                'CARGO' => $emp->CARGO,
                'ESTADO' => $emp->ESTADO,
                'turnos' => $emp->turnos
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

        $datosActualizados = [
            'NOMBRE' => $request->nombre ?? $empleado->NOMBRE,
            'CORREO' => $request->correo ?? $empleado->CORREO,
            'CARGO'  => $request->cargo ?? $empleado->CARGO,
            'ID_ROL' => $request->id_rol ?? $empleado->ID_ROL,
            'ESTADO' => $request->estado ?? $empleado->ESTADO,
        ];

        // Actualizar la contraseña solo si viene en la request
        if ($request->has('contrasena') && $request->contrasena) {
            $datosActualizados['CONTRASENA'] = ($request->contrasena);
        }

        $empleado->update($datosActualizados);

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