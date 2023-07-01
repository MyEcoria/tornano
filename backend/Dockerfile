# Utiliser l'image de base Node.js 20.2.0
FROM node:20.2.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers locaux dans le conteneur
COPY . .

# Installer les dépendances de l'application
RUN npm install

# Exécuter le fichier index.js
CMD ["node", "index.js"]