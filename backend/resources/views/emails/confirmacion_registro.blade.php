<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registro Exitoso - Pitline</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .highlight {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }
        .info-box {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .terms-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            max-height: 300px;
            overflow-y: auto;
        }
        .terms-title {
            color: #856404;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        .terms-content {
            font-size: 12px;
            line-height: 1.4;
        }
        .terms-list {
            margin: 10px 0;
            padding-left: 20px;
        }
        .terms-list li {
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .acceptance-note {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
            font-weight: bold;
            color: #155724;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Bienvenido a Pitline!</h1>
        <p>Tu registro ha sido exitoso</p>
    </div>
    
    <div class="content">
        <div class="welcome-text">
            <p>Hola <strong>{{ $nombre }}</strong>,</p>
            <p>¡Te damos la más cordial bienvenida a Pitline! Estamos muy contentos de que formes parte de nuestro equipo.</p>
        </div>

        <div class="info-box">
            <h3>📋 Información de tu cuenta:</h3>
            <p><strong>Nombre:</strong> {{ $nombre }}</p>
            <p><strong>Correo:</strong> {{ $correo }}</p>
            <p><strong>Cargo:</strong> {{ $cargo }}</p>
            <p><strong>Fecha de registro:</strong> {{ now()->format('d/m/Y H:i:s') }}</p>
        </div>

        <div class="acceptance-note">
            Al ser contratado, aceptas automáticamente nuestros Términos y Condiciones
        </div>

        <div class="terms-section">
            <div class="terms-title">📜 TÉRMINOS Y CONDICIONES DE USO</div>
            <div class="terms-content">
                <p><strong>Bienvenido a nuestra plataforma. Al utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones:</strong></p>
                
                <ul class="terms-list">
                    <li><strong>Veracidad de la información:</strong> El usuario se compromete a proporcionar información veraz y actualizada en todo momento.</li>
                    
                    <li><strong>Uso adecuado:</strong> No se permite el uso de la plataforma con fines ilegales o fraudulentos. Cualquier actividad que viole leyes locales, estatales o federales está estrictamente prohibida.</li>
                    
                    <li><strong>Limitación de responsabilidad:</strong> La empresa no se hace responsable por pérdidas o daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del sistema.</li>
                    
                    <li><strong>Seguridad y acceso:</strong> Se prohíbe terminantemente el intento de acceso no autorizado a otras cuentas, secciones restringidas de la plataforma o cualquier actividad que comprometa la seguridad del sistema.</li>
                    
                    <li><strong>Confidencialidad:</strong> El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de cualquier actividad que ocurra bajo su cuenta.</li>
                    
                    <li><strong>Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma o por correo electrónico.</li>
                    
                    <li><strong>Aceptación continua:</strong> Al continuar usando la plataforma después de cualquier modificación, aceptas todos los términos actualizados descritos aquí.</li>
                </ul>
                
                <p><strong>Al acceder y utilizar Pitline, confirmas que has leído, comprendido y aceptado estar sujeto a estos Términos y Condiciones.</strong></p>
            </div>
        </div>

        <div class="highlight">
            <h3>🎯 ¿Qué puedes hacer ahora?</h3>
            <p>• Acceder al sistema con tus credenciales</p>
            <p>• Gestionar turnos y atención al cliente</p>
            <p>• Colaborar con tu equipo de trabajo</p>
            <p>• Reportar incidencias y seguimientos</p>
        </div>

        <div class="highlight">
            <h3>🔒 Políticas de Privacidad</h3>
            <p>En Pitline nos tomamos muy en serio la protección de tus datos personales. Te invitamos a revisar nuestras políticas de privacidad completas en:</p>
            <a href="{{ route('politicas.privacidad') }}" class="btn">Ver Políticas de Privacidad Completas</a>
        </div>

        <p>Si tienes alguna pregunta sobre estos términos o necesitas ayuda, no dudes en contactar al administrador del sistema.</p>
        
        <p>¡Que tengas un excelente día!</p>
        <p><strong>El equipo de Pitline</strong></p>
    </div>

    <div class="footer">
        <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
        <p>© {{ date('Y') }} Pitline. Todos los derechos reservados.</p>
        <p>
            <a href="#" style="color: #667eea;">Políticas de Privacidad</a> | 
            <a href="#" style="color: #667eea;">Términos de Servicio</a> |
            <a href="#" style="color: #667eea;">Soporte Técnico</a>
        </p>
    </div>
</body>
</html>