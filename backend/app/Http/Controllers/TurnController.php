<?php

namespace App\Http\Controllers;
use App\Models\Turno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TurnController extends Controller
{
    public function filaActual(Request $request)
    {
        // Obtener el cargo desde query string (?cargo=reparacion o ?cargo=cotizacion)
        $cargo = strtolower($request->query('cargo'));

        Log::info("API filaActual llamada con cargo: " . ($cargo ?: 'null')); // 👈 LOG CORREGIDO

        $query = Turno::select('ID_TURNO','NOMBRE','APELLIDOS','ID_AREA','FECHA','HORA','ESTATUS')
            ->where('ESTATUS', 'Pendiente');

        // Filtrar según el cargo SOLO si se proporciona
        if ($cargo === 'reparacion') {
            $query->where('ID_AREA', 1);
            Log::info("Filtrando por reparación (ID_AREA = 1)");
        } elseif ($cargo === 'cotizacion') {
            $query->where('ID_AREA', 2);
            Log::info("Filtrando por cotización (ID_AREA = 2)");
        } else {
            Log::info("Sin filtro - mostrando todos los turnos");
        }

        $turnos = $query->orderBy('FECHA', 'asc')
            ->orderBy('HORA', 'asc')
            ->limit(3) 
            ->get();

        Log::info("Turnos encontrados: " . $turnos->count());

        $turnosFormatted = $turnos->map(function($t) {
            return [
                'turn_number' => $t->ID_TURNO,
                'name' => $t->NOMBRE . ' ' . $t->APELLIDOS,
                'reason' => $t->ID_AREA == 1 ? 'reparacion' : 'cotizacion',
                'status' => strtolower($t->ESTATUS),
                'priority' => 'normal',
            ];
        });

        return response()->json($turnosFormatted);
    }


    public function ultimo()
    {
        $turno = DB::table('TURNOS')
            ->orderBy('FECHA', 'desc')
            ->orderBy('HORA', 'desc')
            ->first();

        return response()->json(['turno' => $turno]);
    }

    public function historial(Request $request)
    {
        $query = DB::table('TURNOS')
            ->leftJoin('EMPLEADO', 'TURNOS.ID_EMPLEADO', '=', 'EMPLEADO.ID_EMPLEADO')
            ->select(
                'TURNOS.ID_TURNO',
                'TURNOS.NOMBRE as cliente_nombre',
                'TURNOS.APELLIDOS as cliente_apellidos',
                'TURNOS.ID_AREA',
                'TURNOS.FECHA',
                'TURNOS.HORA',
                'TURNOS.ESTATUS as estado',
                'TURNOS.TELEFONO as cliente_telefono',
                'TURNOS.DURACION',
                'EMPLEADO.NOMBRE as NOMBRE_EMPLEADO',
                'EMPLEADO.ID_EMPLEADO as ID_EMPLEADO_EMPLEADO',
                'EMPLEADO.CORREO as CORREO_EMPLEADO'
            );

        if ($request->q) {
            $query->where(function ($sub) use ($request) {
                $sub->where('TURNOS.ID_TURNO', 'like', "%{$request->q}%")
                    ->orWhere('TURNOS.NOMBRE', 'like', "%{$request->q}%")
                    ->orWhere('TURNOS.APELLIDOS', 'like', "%{$request->q}%")
                    ->orWhere('TURNOS.TELEFONO', 'like', "%{$request->q}%");
            });
        }

        if ($request->estado && $request->estado !== 'todos') {
            $query->whereRaw('LOWER(TURNOS.ESTATUS) = ?', [strtolower($request->estado)]);
        }

        if ($request->desde) {
            $query->whereDate('TURNOS.FECHA', '>=', $request->desde);
        }

        if ($request->hasta) {
            $query->whereDate('TURNOS.FECHA', '<=', $request->hasta);
        }

        $perPage = $request->limit ?? 12;

        $turnos = $query->orderBy('TURNOS.FECHA', 'desc')
            ->orderBy('TURNOS.HORA', 'desc')
            ->paginate($perPage);

        $turnosFormatted = $turnos->getCollection()->map(function($t) {
            return [
                'folio' => $t->ID_TURNO,
                'cliente' => $t->cliente_nombre . ' ' . $t->cliente_apellidos,
                'servicio' => $t->ID_AREA == 1 ? 'Reparación' : 'Cotización',
                'fecha' => $t->FECHA,
                'hora' => $t->HORA,
                'estado' => strtolower($t->estado),
                'NOMBRE_EMPLEADO' => $t->NOMBRE_EMPLEADO ?? null, // el nombre del empleado
                'ID_EMPLEADO' => $t->ID_EMPLEADO_EMPLEADO ?? null, // id del empleado que atendió
                'CORREO_EMPLEADO' => $t->CORREO_EMPLEADO ?? null,
                'duracion' => $t->DURACION ?? null, // duración del turno
            ];
        });

        return response()->json([
            'data' => $turnosFormatted->toArray(),
            'page' => $turnos->currentPage(),
            'totalPages' => $turnos->lastPage(),
            'total' => $turnos->total(),
        ]);
    


        // Mantén la paginación
        return response()->json([
            'data' => $turnosFormatted->toArray(),
            'page' => $turnos->currentPage(),
            'totalPages' => $turnos->lastPage(),
            'total' => $turnos->total(),
        ]);
    }

    public function enAtencion()
    {
        $turno = Turno::where('ESTATUS', 'En_atencion')
            ->orderBy('ATENCION_EN', 'desc') // el más reciente primero
            ->first();
    
        if ($turno) {
            // obtener nombre del empleado sin romper estructura
            $empleadoNombre = null;
            if ($turno->ID_EMPLEADO) {
                $empleado = DB::table('EMPLEADO')
                    ->where('ID_EMPLEADO', $turno->ID_EMPLEADO)
                    ->select('NOMBRE',)
                    ->first();
                if ($empleado) {
                    $empleadoNombre = $empleado->NOMBRE;
                }
            }
        
            return response()->json([
                'turno' => [
                    'ID_TURNO' => $turno->ID_TURNO,
                    'cliente' => $turno->NOMBRE . ' ' . $turno->APELLIDOS,
                    'ID_EMPLEADO' => $turno->ID_EMPLEADO,
                    'estado' => $turno->ESTATUS,
                    'fecha_atencion' => $turno->FECHA,
                    'hora_atencion' => $turno->HORA,
                    'ATENCION_EN' => $turno->ATENCION_EN,
                    'ATENCION_FIN' => $turno->ATENCION_FIN,
                    // 👇 extra opcional, no afecta al card si no lo usas
                    'empleado_nombre' => $empleadoNombre,
                    'DURACION' => $turno->DURACION,
                ]
            ], 200);
        } else {
            return response()->json(['turno' => null], 200);
        }
    }



    public function store(Request $request)
    {
        // Validar datos básicos
        $request->validate([
            'ID_AREA' => 'required|integer',
            'NOMBRE' => 'required|string',
            'APELLIDOS' => 'required|string',
            'TELEFONO' => 'required|string',
        ]);

        // Determinar prefijo según área
        $prefijo = $request->ID_AREA == 1 ? 'R' : 'C'; 

        // Obtener último turno con ese prefijo
        $ultimoTurno = DB::table('TURNOS')
            ->where('ID_TURNO', 'like', $prefijo.'%')
            ->orderBy('ID_TURNO', 'desc')
            ->first();

        // Generar consecutivo
        if ($ultimoTurno) {
            $ultimoNumero = (int) substr($ultimoTurno->ID_TURNO, 1);
            $nuevoNumero = str_pad($ultimoNumero + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $nuevoNumero = "001";
        }

        $nuevoTurno = $prefijo . $nuevoNumero;

        // Guardar en la BD
        $id = DB::table('TURNOS')->insertGetId([
            'ID_TURNO' => $nuevoTurno,
            'ID_AREA' => $request->ID_AREA,
            'ID_EMPLEADO' => $request->ID_EMPLEADO ?? null,
            'FECHA' => now()->toDateString(),
            'HORA' => now()->toTimeString(),
            'ESTATUS' => 'Pendiente',
            'NOMBRE' => $request->NOMBRE,
            'APELLIDOS' => $request->APELLIDOS,
            'TELEFONO' => $request->TELEFONO,
        ]);

        return response()->json([
            'success' => true,
            'turno' => $nuevoTurno,
        ]);
    }

    public function pasarTurno(Request $request)
    {
        $empleadoId = $request->input('empleado_id');
        $cargo = strtolower($request->input('cargo')); // opcional, para filtrar cola

        // 1. Marcar como atendido el turno actual de ese empleado
        $turnoActual = Turno::where('ID_EMPLEADO', $empleadoId)
            ->where('ESTATUS', 'En_atencion')
            ->first();

        if ($turnoActual) {
            $turnoActual->ESTATUS = 'Completado';
            $turnoActual->ATENCION_FIN = now(); // registrar hora de finalización
            // Calcular y guardar la duración
            if ($turnoActual->ATENCION_EN) {
                $inicio = \Carbon\Carbon::parse($turnoActual->ATENCION_EN);
                $fin = \Carbon\Carbon::parse($turnoActual->ATENCION_FIN);
                $duracionMinutos = $inicio->diffInMinutes($fin);
                
                // Convertir a formato horas:minutos
                $horas = floor($duracionMinutos / 60);
                $minutos = $duracionMinutos % 60;
                $turnoActual->DURACION = sprintf("%02d:%02d", $horas, $minutos);
            }
            
            $turnoActual->save();
        }

        // 2. Buscar siguiente en la cola
        $query = Turno::where('ESTATUS', 'Pendiente');

        if ($cargo === 'reparacion') {
            $query->where('ID_AREA', 1);
        } elseif ($cargo === 'cotizacion') {
            $query->where('ID_AREA', 2);
        }

        $siguiente = $query->orderBy('FECHA', 'asc')
            ->orderBy('HORA', 'asc')
            ->first();

        // 3. Asignarlo al empleado
        if ($siguiente) {
            $siguiente->ID_EMPLEADO = $empleadoId;
            $siguiente->ESTATUS = 'En_atencion';
            $siguiente->ATENCION_EN = now();
            $siguiente->save();
        }

        return response()->json([
            'success' => true,
            'turno_atendido' => $turnoActual,
            'nuevo_turno' => $siguiente,
        ]);
    }

    public function guardarDiagnostico(Request $request, $idTurno)
    {
        $request->validate([
            'descripcion' => 'required|string',
            'fechaEntrega' => 'required|date',
            'tipoServicio' => 'required|string',
        ]);

        $turno = Turno::where('ID_TURNO', $idTurno)->first();
        
        if (!$turno) {
            return response()->json(['error' => 'Turno no encontrado'], 404);
        }

        $turno->DESCRIPCION = $request->descripcion;
        $turno->TIEMPO_ENTREGA = $request->fechaEntrega;
        $turno->TIPO_SERVICIO = $request->tipoServicio;
        $turno->save();

        return response()->json(['success' => true, 'turno' => $turno]);
    }


}
