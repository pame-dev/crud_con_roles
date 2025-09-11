<?php

namespace App\Http\Controllers;
use App\Models\Turno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TurnController extends Controller
{
    public function filaActual()
    {
        // Solo los turnos pendientes
        $turnos = Turno::select('ID_TURNO','NOMBRE','APELLIDOS','ID_AREA','FECHA','HORA','ESTATUS')
            ->where('ESTATUS', 'Pendiente')
            ->orderBy('FECHA', 'asc')
            ->orderBy('HORA', 'asc')
            ->limit(4) // por ejemplo, mostrar máximo 10 turnos
            ->get();

        // Formatear para el frontend
        $turnosFormatted = $turnos->map(function($t) {
            return [
                'turn_number' => $t->ID_TURNO,
                'name' => $t->NOMBRE . ' ' . $t->APELLIDOS,
                'reason' => $t->ID_AREA == 1 ? 'reparacion' : 'cotizacion',
                'status' => strtolower($t->ESTATUS), // pendiente
                'priority' => 'normal', // puedes ajustar si quieres prioridades
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
        $query = Turno::select('ID_TURNO','NOMBRE','APELLIDOS','ID_AREA','FECHA','HORA','ESTATUS');

    
        if ($request->q) {
            $query->where(function ($sub) use ($request) {
                $sub->where('ID_TURNO', 'like', "%{$request->q}%")
                    ->orWhere('NOMBRE', 'like', "%{$request->q}%")
                    ->orWhere('APELLIDOS', 'like', "%{$request->q}%")
                    ->orWhere('TELEFONO', 'like', "%{$request->q}%");
            });
        }
    
        if ($request->estado && $request->estado !== 'todos') {
            $query->whereRaw('LOWER(ESTATUS) = ?', [strtolower($request->estado)]);
        }
    
        if ($request->desde) {
            $query->whereDate('FECHA', '>=', $request->desde);
        }
    
        if ($request->hasta) {
            $query->whereDate('FECHA', '<=', $request->hasta);
        }
    
        $perPage = $request->limit ?? 12;
    
        $turnos = $query->orderBy('FECHA', 'desc')
                ->orderBy('HORA', 'desc')
                ->paginate($perPage);

        $turnosFormatted = $turnos->getCollection()->map(function($t) {
        return [
            'folio' => $t->ID_TURNO,
            'cliente' => $t->NOMBRE . ' ' . $t->APELLIDOS,
            'servicio' => $t->ID_AREA == 1 ? 'Reparación' : 'Cotización',
            'fecha' => $t->FECHA,
            'hora' => $t->HORA,
            'estado' => strtolower($t->ESTATUS),
        ];
    });

    // Mantén la paginación
    return response()->json([
        'data' => $turnosFormatted->toArray(),
        'page' => $turnos->currentPage(),
        'totalPages' => $turnos->lastPage(),
        'total' => $turnos->total(),
    ]);
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
}
