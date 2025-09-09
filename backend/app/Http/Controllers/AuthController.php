<?php
namespace App\Http\Controllers;
use App\Models\Empleado;
use Illuminate\Http\Request; // ← Esto importa correctamente Request

// Controlador encargado de la autenticación de empleados.
// Valida el usuario y contraseña recibidos desde el frontend
// y devuelve los datos del empleado en formato JSON si son correctos.

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = Empleado::where('CORREO', $request->user)->first();

        if (!$user || $user->CONTRASENA !== $request->pass) {
            return response()->json(['error' => 'Usuario o contraseña incorrectos'], 401);
        }

        
        return response()->json([
            'ID_EMPLEADO' => $user->ID_EMPLEADO,
            'ID_ROL' => $user->ID_ROL,
            'CARGO' => $user->CARGO,
            'CORREO' => $user->CORREO,
            'NOMBRE' => $user->NOMBRE
        ]);
    }
}
