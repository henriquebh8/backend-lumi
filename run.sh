#!/bin/bash

docker-compose up --build -d

check_backend_ready() {
  docker-compose logs backend-api | grep -q "Server running on http://localhost:3001"
}

echo "Aguardando o backend estar online..."
until check_backend_ready; do
  echo "Backend ainda não está pronto - aguardando..."
  sleep 5
done

MIGRATION_NAME="init_$(date +%s)"

docker-compose exec backend-api sh -c "npx prisma migrate dev --name $MIGRATION_NAME && npx prisma generate"

echo "Migrações aplicadas e cliente Prisma gerado com sucesso."
