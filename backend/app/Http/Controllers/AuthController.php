<?php
namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarContrasenaMail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = Empleado::where('CORREO', $request->user)->first();
                        // Buscar al usuario por correo
        $user = Empleado::where('CORREO', $request->user)->first();

        if (!$user) {
            return response()->json([
                'error' => 'El correo no está registrado en el sistema.'
            ], 404); // 🔹 código 404 para indicar "no encontrado"
        }

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

    // 1️⃣ Solicitar código
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = Empleado::where('CORREO', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'El correo no está registrado en el sistema.'
            ], 404);
        }

        // generar token, enviar correo...
        return response()->json([
            'message' => 'Se envió un código a tu correo.'
        ]);
    }


    // 2️⃣ Verificar código (solo validación)
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|digits:6',
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

        return response()->json(['message' => 'Código válido']);
    }

    // 3️⃣ Restablecer contraseña
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'        => 'required|email',
            'code'         => 'required|digits:6',
            'new_password' => 'required|min:8'
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['error' => 'Código inválido'], 400);
        }

        $user = Empleado::where('CORREO', $request->email)->first();
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // ⚠️ Si quieres encriptar: usa bcrypt
        Empleado::where('CORREO', $request->email)->update([
        'CONTRASENA' => $request->new_password
    ]);

        // Borrar el token usado
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
