<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://crud-con-roles.vercel.app',
            'https://pitline.site',
            'https://www.pitline.site',
        ];

        $origin = $request->headers->get('Origin');
        
        // Validar si el origen está permitido
        $allowedOrigin = in_array($origin, $allowedOrigins) ? $origin : null;

        // Manejar preflight OPTIONS
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $allowedOrigin ?? 'https://pitline.site')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '600');
        }

        $response = $next($request);

        // Agregar headers CORS a la respuesta
        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin ?? 'https://pitline.site');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        return $response;
    }
}