#!/bin/bash

# Script para cargar datos de clientes usando neonctl
# Uso: ./load_clients.sh [project-id] [branch-name]

PROJECT_ID="${1:-}"
BRANCH_NAME="${2:-main}"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Se requiere el project-id de Neon"
    echo ""
    echo "Uso: ./load_clients.sh <project-id> [branch-name]"
    echo ""
    echo "Ejemplo: ./load_clients.sh proj_abc123 main"
    echo ""
    echo "Para obtener tu project-id:"
    echo "  neonctl projects list"
    exit 1
fi

echo "🚀 Cargando datos de clientes en Neon..."
echo "   Project ID: $PROJECT_ID"
echo "   Branch: $BRANCH_NAME"
echo ""

# Ejecutar el script SQL
neonctl sql --project-id "$PROJECT_ID" --branch-name "$BRANCH_NAME" < load_clients.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Datos cargados exitosamente!"
else
    echo ""
    echo "❌ Error al cargar los datos"
    exit 1
fi

