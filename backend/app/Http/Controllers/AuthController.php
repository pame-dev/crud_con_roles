<?php
namespace App\Http\Controllers;
use App\Models\Empleado;
use Illuminate\Http\Request; // ← Esto importa correctamente Request
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarContrasenaMail;
use Illuminate\Support\Facades\DB;



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
            // ✅ Guardar o actualizar el código en la tabla password_resets
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                ['token' => $code, 'created_at' => now()]
            );

            // Enviar correo con el código
            Mail::to($request->email)->send(new RecuperarContrasenaMail($request->email, $code));

            return response()->json([
                'message' => 'Código enviado al correo ' . $request->email
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|digits:6',
            'new_password' => 'required|min:6'
        ]);

        $record = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$record) {
            return response()->json(['error' => 'Código no encontrado'], 404);
        }

        if ($record->token != $request->code) {
            return response()->json(['error' => 'Código incorrecto'], 401);
        }
        if (now()->diffInMinutes($record->created_at) > 15) {
            return response()->json(['error' => 'Código expirado'], 401);
        }

        // Actualizar la contraseña del empleado
        Empleado::where('CORREO', $request->email)->update([
            'CONTRASENA' => $request->new_password
        ]);

        // Opcional: borrar el registro del código
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

}