<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    protected $table = 'TURNOS';  //  nombre exacto de tu tabla
    protected $primaryKey = 'ID_TURNO';
    public $timestamps = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'ID_TURNO', 'ID_AREA', 'ID_EMPLEADO', 'FECHA', 'HORA',
        'ESTATUS', 'NOMBRE', 'APELLIDOS', 'TELEFONO'
    ];
}
