<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Empleado;
use Illuminate\Support\Facades\Hash;

class HashPasswords extends Command
{
    protected $signature = 'empleados:hash-passwords';
    protected $description = 'Convierte contraseñas en texto plano a hashes';

    public function handle()
    {
        $empleados = Empleado::all();
        $count = 0;

        foreach ($empleados as $empleado) {
            // Solo si la contraseña NO parece un hash bcrypt
            if (!str_starts_with($empleado->CONTRASENA, '$2y$')) {
                $empleado->CONTRASENA = Hash::make($empleado->CONTRASENA);
                $empleado->save();
                $count++;
            }
        }

        $this->info("Se han hasheado $count contraseñas correctamente.");
        return 0;
    }
}
