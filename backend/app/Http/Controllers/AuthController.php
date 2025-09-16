<?php
namespace App\Http\Controllers;
use App\Models\Empleado;
use Illuminate\Http\Request; // ← Esto importa correctamente Request
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarContrasenaMail;


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
            'CONTRASENA' => $user->CONTRASENA,
            'NOMBRE' => $user->NOMBRE
        ]);
    }
    // NUEVO MÉTODO: Maneja la solicitud de restablecimiento de contraseña
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $code = rand(100000, 999999);

        try {
            Mail::to($request->email)->send(new RecuperarContrasenaMail($request->email, $code));

            return response()->json([
                'message' => 'Código enviado al correo ' . $request->email,
                // ⚠️ Solo en desarrollo, en producción NO devuelvas el código
                'code' => $code
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}