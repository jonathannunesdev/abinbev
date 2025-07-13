#!/bin/bash

# Script para configurar o banco de dados PostgreSQL
echo "🚀 Configurando banco de dados..."

# Verificar se o PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL não está rodando. Inicie o PostgreSQL primeiro."
    exit 1
fi

# Criar banco de dados se não existir
echo "📝 Criando banco de dados 'abi_db'..."
createdb abi_db 2>/dev/null || echo "ℹ️  Banco 'abi_db' já existe"

# Executar script de inicialização
echo "🔧 Executando script de inicialização..."
psql -d abi_db -f ./scripts/database/init.sql

echo "✅ Configuração concluída!"
echo "📋 Próximos passos:"
echo "   1. Configure o arquivo .env"
echo "   2. Execute 'yarn start:dev' para iniciar o servidor" 