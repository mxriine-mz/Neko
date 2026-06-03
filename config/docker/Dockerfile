# Utiliser Node.js 20 LTS
FROM node:20-alpine

# Installer les dépendances système pour Canvas et Prisma
RUN apk add --no-cache \
    openssl \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances (chemins relatifs au build context = racine projet)
COPY package*.json ./
COPY config/prisma ./config/prisma/

# Installer toutes les dépendances (nodemon et prisma CLI sont requis par la commande compose)
RUN npm install

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate --schema=./config/prisma/schema.prisma

# Exposer le port (optionnel pour monitoring)
EXPOSE 3000

# Commande de démarrage (surchargée par docker-compose)
CMD ["npm", "start"]
