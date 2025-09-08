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
        'CARGO',
        'CONTRASENA',
        'ID_ROL'
    ];
}
