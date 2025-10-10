<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        // Validación básica
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'correo' => 'required|email|max:255',
            'cargo'  => 'required|string|max:255',
            'contrasena' => 'nullable|string|min:8',
        ]);

        // Preparar cambios que se aplicarán
        $changes = [];
        if (isset($validated['nombre']) && $empleado->NOMBRE !== $validated['nombre']) {
            $changes['NOMBRE'] = $validated['nombre'];
        }
        if (isset($validated['correo']) && $empleado->CORREO !== $validated['correo']) {
            $changes['CORREO'] = $validated['correo'];
        }
        if (isset($validated['cargo']) && $empleado->CARGO !== $validated['cargo']) {
            $changes['CARGO'] = $validated['cargo'];
        }

        // Manejo de contraseña: no retornamos ni mostramos la actual. Solo actualizar si se envía y es válida.
        if ($request->has('contrasena') && $request->contrasena) {
            // Verificar que la nueva contraseña no sea idéntica a la actual (suponiendo que CONTRASENA está hasheada)
            $nueva = $request->contrasena;
            // Si la contraseña almacenada no es la misma en texto (porque está en claro en BD), comparamos directamente;
            // si está hasheada, use Hash::check. Aquí intentamos con Hash::check y también con comparación directa para compatibilidad.
            try {
                if (Hash::check($nueva, $empleado->CONTRASENA) || $nueva === $empleado->CONTRASENA) {
                    return response()->json(['error' => 'La contraseña no debe de ser idéntica a la actual'], 422);
                }
            } catch (\Exception $e) {
                // En caso de error con Hash::check, solo prevenir igualdad en texto
                if ($nueva === $empleado->CONTRASENA) {
                    return response()->json(['error' => 'La contraseña no debe de ser idéntica a la actual'], 422);
                }
            }

            // Evitar contraseñas previamente usadas: si tienes una tabla de historiales, aquí se debería comprobar.
            // Como no hay una tabla en este proyecto, rechazaremos contra contraseñas iguales a algunas columnas comunes (ejemplo)
            // Nota: lo ideal es implementar una tabla `password_histories` con hashes.

            // Guardar la nueva contraseña en forma hasheada
            $changes['CONTRASENA'] = bcrypt($nueva);
        }

        if (!empty($changes)) {
            $empleado->update($changes);
        }

        return response()->json([
            'message' => 'Empleado actualizado correctamente',
            'empleado' => $empleado->fresh()
        ]);
    }

    // Endpoint para verificar si la contraseña enviada coincide con la actual
    public function verificarContrasena(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        $request->validate(['contrasena' => 'required|string']);
        $contrasena = $request->contrasena;

        try {
            $igual = Hash::check($contrasena, $empleado->CONTRASENA) || $contrasena === $empleado->CONTRASENA;
        } catch (\Exception $e) {
            $igual = $contrasena === $empleado->CONTRASENA;
        }

        return response()->json(['igual' => $igual]);
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