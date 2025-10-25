<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Turno;
use App\Models\Empleado;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    // 1️⃣ Turnos por empleado (excluye DURACION NULL)
    public function turnosPorEmpleado()
    {
        $data = Turno::whereNotNull('DURACION')
            ->select('ID_EMPLEADO', DB::raw('count(*) as turnos'))
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

    // 2️⃣ Tiempo promedio de atención por tipo de turno (ID_AREA: 1 = Reparación, 2 = Cotización)
    public function tiemposPromedio()
    {
        $data = Turno::whereNotNull('DURACION')
            ->select(
                'ID_AREA',
                DB::raw('avg(DURACION) as promedio')
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
        $data = Turno::whereNotNull('DURACION')
            ->select(
                DB::raw('DAYNAME(FECHA) as dia'), 
                DB::raw('count(*) as turnos')
            )
            ->groupBy(DB::raw('DAYNAME(FECHA)'))
            ->get();

        return response()->json($data);
    }

    // 4️⃣ Distribución de turnos por tipo de servicio
    public function turnosPorTipo()
    {
        $data = Turno::whereNotNull('DURACION')
            ->select(
                'ID_AREA', 
                DB::raw('count(*) as turnos')
            )
            ->groupBy('ID_AREA')
            ->get()
            ->map(function($item){
                $tipo = $item->ID_AREA == 1 ? 'Reparación' : ($item->ID_AREA == 2 ? 'Cotización' : 'Otro');
                return [
                    'tipo' => $tipo,
                    'turnos' => $item->turnos
                ];
            });

        return response()->json($data);
    }

    // 5️⃣ Tiempo promedio por empleado (eficiencia, ranking)
    public function tiempoPorEmpleado()
    {
        $data = Turno::whereNotNull('DURACION')
            ->select(
                'ID_EMPLEADO',
                DB::raw('avg(DURACION) as promedio')
            )
            ->groupBy('ID_EMPLEADO')
            ->with('empleado:ID_EMPLEADO,NOMBRE')
            ->get()
            ->map(function($item){
                return [
                    'empleado' => $item->empleado ? $item->empleado->NOMBRE : 'Sin empleado',
                    'promedio' => round($item->promedio / 60, 1) // minutos a horas
                ];
            });

        return response()->json($data);
    }
}
