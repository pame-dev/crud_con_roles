<?php
namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarContrasenaMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function enviarCodigo(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'codigo' => 'required|numeric',
        ]);

        try {
            // Eliminar códigos antiguos del correo
            DB::table('registro_codigos')->where('correo', $request->correo)->delete();

            // Insertar nuevo código
            DB::table('registro_codigos')->insert([
                'correo' => $request->correo,
                'codigo' => $request->codigo,
                'created_at' => now()
            ]);

            // Enviar correo con el código
            Mail::to($request->correo)
            ->send(new \App\Mail\CodigoRegistroMail($request->correo, $request->codigo));

            return response()->json([
                'success' => true,
                'message' => 'Código enviado y guardado correctamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error enviando código de verificación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar código'
            ], 500);
        }
    }



    public function login(Request $request)
    {
                        // Buscar al usuario por correo
        $user = Empleado::where('CORREO', $request->user)->first();

        if (!$user) {
            return response()->json([
                'error' => 'El correo no está registrado en el sistema.'
            ], 404); // 🔹 código 404 para indicar "no encontrado"
        }

         // Verificar contraseña
        if (!Hash::check($request->pass, $user->CONTRASENA)) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta.'
            ], 401);
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

        $code = rand(100000, 999999);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $code, 'created_at' => now()]
        );

        Mail::to($request->email)->send(new RecuperarContrasenaMail($request->email, $code));
                return response()->json(['message' => 'Código de recuperación enviado al correo.']);
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
            'CONTRASENA' => Hash::make($request->new_password)
    ]);

        // Borrar el token usado
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

    public function correoExiste(Request $request)
{
    $request->validate([
        'correo' => 'required|email',
        'id' => 'nullable|integer',
    ]);

    $query = Empleado::where('CORREO', $request->correo);

    // Si está editando, excluir su propio ID
    if ($request->id) {
        $query->where('ID_EMPLEADO', '!=', $request->id);
    }

    $existe = $query->exists();

    return response()->json(['existe' => $existe]);
}

}
