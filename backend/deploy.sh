#!/bin/bash

echo "Running post-deployment tasks..."

# Crear directorios de storage si no existen
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Dar permisos
chmod -R 775 storage
chmod -R 775 bootstrap/cache

echo "Post-deployment tasks completed!"
