<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionCambioContrasenaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $correo;
    public $fecha;
    public $ip;
    public $userAgent;

    /**
     * Create a new message instance.
     */
    public function __construct($nombre, $correo, $fecha, $ip, $userAgent)
    {
        $this->nombre = $nombre;
        $this->correo = $correo;
        $this->fecha = $fecha;
        $this->ip = $ip;
        $this->userAgent = $userAgent;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Notificación de cambio de contraseña en tu cuenta PitLine')
                    ->view('emails.notificacion_cambio_contrasena')
                    ->with([
                        'nombre' => $this->nombre,
                        'correo' => $this->correo,
                        'fecha' => $this->fecha,
                        'ip' => $this->ip,
                        'userAgent' => $this->userAgent,
                    ]);
    }
}
