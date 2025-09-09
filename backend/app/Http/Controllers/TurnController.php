<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TurnController extends Controller
{
    public function ultimo()
    {
        $turno = DB::table('TURNO')
            ->orderBy('FECHA', 'desc')
            ->orderBy('HORA', 'desc')
            ->first();

        return response()->json(['turno' => $turno]);
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
        $ultimoTurno = DB::table('TURNO')
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
        $id = DB::table('TURNO')->insertGetId([
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
