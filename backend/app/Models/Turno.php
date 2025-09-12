<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    protected $table = 'TURNOS';
    protected $primaryKey = 'ID_TURNO';
    public $timestamps = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'ID_TURNO', 'ID_AREA', 'ID_EMPLEADO', 'FECHA', 'HORA',
        'ESTATUS', 'NOMBRE', 'APELLIDOS', 'TELEFONO'
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'ID_EMPLEADO', 'ID_EMPLEADO');
    }
}
