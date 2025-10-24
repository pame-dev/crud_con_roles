<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Turno;
use App\Models\Empleado;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    // 1️⃣ Turnos por empleado
    public function turnosPorEmpleado()
    {
        $data = Turno::select('ID_EMPLEADO', DB::raw('count(*) as turnos'))
            ->groupBy('ID_EMPLEADO')
            ->with('empleado:ID_EMPLEADO,NOMBRE')
            ->get()
            ->map(function($item){
                return [
                    'empleado' => $item->empleado ? $item->empleado->NOMBRE : 'Sin empleado',
                    'turnos' => $item->turnos,
                ];
            });

        return response()->json($data);
    }

    // 2️⃣ Tiempo promedio de atención por tipo de turno (ID_AREA: 1 = Reparacion, 2 = Cotizacion)
    public function tiemposPromedio()
    {
        $data = Turno::select(
                'ID_AREA',
                DB::raw('avg(DURACION) as promedio')  // <- Usamos la columna DURACION directamente
            )
            ->groupBy('ID_AREA')
            ->get()
            ->map(function($item){
                $tipo = $item->ID_AREA == 1 ? 'Reparación' : ($item->ID_AREA == 2 ? 'Cotización' : 'Otro');
                return [
                    'tipo' => $tipo,
                    'promedio' => round($item->promedio, 1),
                ];
            });
        
        return response()->json($data);
    }


    // 3️⃣ Turnos por día de la semana
    public function turnosPorDia()
    {
        $data = Turno::select(
                DB::raw('DAYNAME(FECHA) as dia'), 
                DB::raw('count(*) as turnos')
            )
            ->groupBy(DB::raw('DAYNAME(FECHA)'))
            ->get();

        return response()->json($data);
    }
}
