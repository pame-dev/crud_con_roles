<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmacionRegistroMail extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $correo;
    public $cargo;

    public function __construct($nombre, $correo, $cargo)
    {
        $this->nombre = $nombre;
        $this->correo = $correo;
        $this->cargo = $cargo;
    }

    public function build()
    {
        return $this->subject('¡Bienvenido a Pitline - Registro Exitoso!')
                    ->view('emails.confirmacion_registro')
                    ->with([
                        'nombre' => $this->nombre,
                        'correo' => $this->correo,
                        'cargo' => $this->cargo
                    ]);
    }
}