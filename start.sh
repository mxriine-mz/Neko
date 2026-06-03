#!/bin/bash
# Script de démarrage Neko 2.0 — bot Discord (Docker Compose).
# Le site public (apps/users-web) et le panneau d'admin (apps/admin-web)
# sont gérés par PM2, pas par ce script.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

mkdir -p "$SCRIPT_DIR/logs"

# Lancer les conteneurs Docker (bot + PostgreSQL)
cd "$SCRIPT_DIR/config/docker" || exit 1
echo "Démarrage du bot..."
docker compose --env-file "$ENV_FILE" up -d --remove-orphans

echo "⏳ Attente du démarrage des services..."
sleep 3

echo ""
echo "✅ Bot démarré !"
echo "════════════════════════════════════════"

# Arrêt propre des conteneurs sur Ctrl-C
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    docker compose --env-file "$ENV_FILE" down
    exit 0
}
trap cleanup INT TERM

# Afficher les logs du bot puis suivre les nouveaux
docker compose --env-file "$ENV_FILE" logs -f --tail=all bot
