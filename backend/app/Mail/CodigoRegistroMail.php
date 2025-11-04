<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CodigoRegistroMail extends Mailable
{
    use Queueable, SerializesModels;

    public $codigo;
    public $correo;

    public function __construct($correo, $codigo)
    {
        $this->correo = $correo;
        $this->codigo = $codigo;
    }

    public function build()
{
    return $this->subject('Código de verificación')
                ->view('emails.codigo_registro')
                ->with([
                    'correo' => $this->correo,
                    'codigo' => $this->codigo
                ]);
}
}