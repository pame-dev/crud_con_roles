<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'EMPLEADO'; 
    protected $primaryKey = 'ID_EMPLEADO'; 
    public $timestamps = false; 

    protected $fillable = [
        'NOMBRE',
        'CORREO',
        'CARGO',
        'CONTRASENA',
        'ID_ROL',
        'ESTADO',
        'ACTIVO'
    ];

    // Relación con Turnos
    public function turnos()
    {
        return $this->hasMany(Turno::class, 'ID_EMPLEADO', 'ID_EMPLEADO');
    }
}
