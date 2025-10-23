<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Mail\NotificacionCambioContrasenaMail;
use App\Mail\CodigoRegistroMail; 

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
        $request->validate([
            'nombre' => 'required|string|min:3',
            'correo' => 'required|email|unique:EMPLEADO,CORREO',
            'cargo' => 'required|string',
            'contrasena' => 'required|string|min:8',
            'id_rol' => 'required|numeric',
            'codigo' => 'required|numeric',
        ]);

        try {
            // Validar el código antes de crear al empleado
            $registro = DB::table('registro_codigos')
                ->where('correo', $request->correo)
                ->orderByDesc('created_at')
                ->first();

            if (!$registro || $registro->codigo != $request->codigo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Código incorrecto o no enviado'
                ], 422);
            }

            // Código válido → eliminarlo para que no se reutilice
            DB::table('registro_codigos')->where('correo', $request->correo)->delete();

            // Crear empleado - CORREGIDO
            $empleado = Empleado::create([
                'NOMBRE' => $request->nombre,
                'CORREO' => $request->correo,
                'CARGO' => $request->cargo,
                'CONTRASENA' => Hash::make($request->contrasena),
                'ID_ROL' => $request->id_rol,
                'ESTADO' => 1, // ← CAMBIO AQUÍ
                'ACTIVO' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Empleado registrado correctamente',
                'empleado' => $empleado
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al registrar empleado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar empleado'
            ], 500);
        }
    }


    public function registrarConCodigo(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|min:3',
            'correo' => 'required|email|unique:EMPLEADO,CORREO',
            'cargo' => 'required|string',
            'contrasena' => 'required|string|min:8',
            'id_rol' => 'required|numeric',
            'codigo' => 'required|numeric',
        ]);

        try {
            // Validar el código antes de crear al empleado
            $registro = DB::table('registro_codigos')
                ->where('correo', $request->correo)
                ->orderByDesc('created_at')
                ->first();

            if (!$registro || $registro->codigo != $request->codigo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Código incorrecto o no enviado'
                ], 422);
            }

            // Código válido → eliminarlo para que no se reutilice
            DB::table('registro_codigos')->where('correo', $request->correo)->delete();

            // Crear empleado - CORREGIDO: usar 1 en lugar de 'ACTIVO'
            $empleado = Empleado::create([
                'NOMBRE' => $request->nombre,
                'CORREO' => $request->correo,
                'CARGO' => $request->cargo,
                'CONTRASENA' => Hash::make($request->contrasena),
                'ID_ROL' => $request->id_rol,
                'ESTADO' => 1, // ← CAMBIO AQUÍ: 1 para activo, 0 para inactivo
                'ACTIVO' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Empleado registrado correctamente',
                'empleado' => $empleado
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al registrar empleado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar empleado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function validarCodigo(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'codigo' => 'required|numeric'
        ]);

        $registro = DB::table('registro_codigos')
            ->where('correo', $request->correo)
            ->orderByDesc('created_at')
            ->first();

        if (!$registro || $registro->codigo != $request->codigo) {
            return response()->json([
                'success' => false,
                'message' => 'Código incorrecto'
            ], 422);
        }

        // Opcional: eliminar el código ya usado
        DB::table('registro_codigos')->where('correo', $request->correo)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Código válido'
        ]);
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

        // Marcar como activo
        $empleado->ACTIVO = 1;  // Cambia de 0 a 1
        $empleado->save();  // Guarda el cambio

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
        $cambioContrasena = false;
        if ($request->has('contrasena') && $request->contrasena) {
            $nueva = $request->contrasena;
            // Comparar en texto plano y evitar la misma contraseña actual
            if ($nueva === $empleado->CONTRASENA) {
                return response()->json(['error' => 'La contraseña no debe de ser idéntica a la actual'], 422);
            }
            // Guardar la nueva contraseña SIN encriptar (según requisito)
            $changes['CONTRASENA'] = $nueva;
            $cambioContrasena = true;
        }


        if (!empty($changes)) {
            $empleado->update($changes);
            // Enviar correo si se cambió la contraseña
            if ($cambioContrasena) {
                $fecha = now()->format('d/m/Y H:i:s');
                $ip = request()->ip();
                $userAgent = request()->header('User-Agent');
                try {
                    Mail::to($empleado->CORREO)->send(new NotificacionCambioContrasenaMail(
                        $empleado->NOMBRE,
                        $empleado->CORREO,
                        $fecha,
                        $ip,
                        $userAgent
                    ));
                } catch (\Exception $e) {
                    Log::error('Error enviando correo de cambio de contraseña: ' . $e->getMessage());
                }
            }
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

        $igual = $contrasena === $empleado->CONTRASENA;

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