<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notificación de cambio de contraseña</title>
</head>
<body>
    <h2>Hola, {{ $nombre }}</h2>
    <p>Te informamos que la contraseña de tu cuenta ha sido modificada recientemente.</p>
    <p><strong>Detalles del cambio:</strong></p>
    <ul>
        <li><strong>Usuario:</strong> {{ $nombre }}</li>
        <li><strong>Correo:</strong> {{ $correo }}</li>
        <li><strong>Fecha y hora:</strong> {{ $fecha }}</li>
        <li><strong>Ubicación (IP):</strong> {{ $ip }}</li>
        <li><strong>Equipo:</strong> {{ $userAgent }}</li>
    </ul>
    <p>Si no reconoces esta acción, por favor contacta inmediatamente al administrador del sistema.</p>
    <p>Saludos,<br>Equipo PitLine</p>
</body>
</html>
