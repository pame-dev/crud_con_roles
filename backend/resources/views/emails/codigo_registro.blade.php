<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Código de Verificación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            color: #007bff;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            letter-spacing: 5px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Código de Verificación</h1>
    </div>
    
    <p>Hola, <strong>{{ $correo }}</strong></p>
    
    <p>Tu código de verificación para el registro es:</p>
    
    <div class="code">{{ $codigo }}</div>
    
    <p>Este código expirará en 15 minutos.</p>
    
    <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
    
    <div class="footer">
        <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
    </div>
</body>
</html>