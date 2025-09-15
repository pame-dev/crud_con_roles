<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecuperarContrasenaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $codigo; 
    public $email;  

    /**
     * Create a new message instance.
     */
    public function __construct($email, $codigo)
    {
        $this->email = $email;
        $this->codigo = $codigo;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Recuperación de contraseña')
                    ->view('emails.recuperar_contrasena') 
                    ->with([
                        'codigo' => $this->codigo,
                        'email'  => $this->email,
                    ]);
    }
}
