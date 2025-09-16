<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recuperación de contraseña</title>
</head>
<body>
    <h2>Hola, {{ $email }}</h2>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p>Tu código de recuperación es:</p>

    <h1 style="color:#2c3e50;">{{ $codigo }}</h1>

    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
</body>
</html>
