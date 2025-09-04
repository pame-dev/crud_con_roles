<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TestDbController extends Controller
{
    public function testConnection()
    {
        try {
            DB::connection()->getPdo();
            
            return response()->json([
                'success' => true,
                'message' => 'Conexión exitosa a MySQL',
                'database' => DB::connection()->getDatabaseName(),
                'version' => DB::connection()->getPdo()->getAttribute(\PDO::ATTR_SERVER_VERSION)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage()
            ], 500);
        }
    }
}