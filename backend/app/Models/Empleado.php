<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// Modelo Eloquent que representa la tabla 'EMPLEADO'.
// Define la clave primaria, los campos rellenables y desactiva timestamps.

class Empleado extends Model
{
    protected $table = 'EMPLEADO'; 
    protected $primaryKey = 'ID_EMPLEADO'; 

    public $timestamps = false; 

    protected $fillable = [
        'NOMBRE',
        'CARGO',
        'CONTRASENA',
        'ID_ROL'
    ];
}
