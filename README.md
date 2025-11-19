# 🚀 Andorya Dashboard - Guide d'Installation (Ubuntu Server)

Ce guide détaille les étapes pour déployer **Andorya Dashboard** sur un serveur Ubuntu en production.

## 📋 Prérequis

*   Un serveur **Ubuntu** (20.04, 22.04 ou plus récent).
*   Un accès **root** ou un utilisateur avec privilèges `sudo`.
*   Une clé API Google Gemini (pour l'analyse des logs).

---

## 🛠️ Méthode 1 : Installation Classique (Nginx + Node.js)

Cette méthode est recommandée pour les performances et la gestion via un serveur web standard.

### Étape 1 : Préparer le système

Mettez à jour votre système et installez les outils nécessaires :

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx
```

### Étape 2 : Installer Node.js (Version 20 LTS)

L'application nécessite Node.js pour la construction (build).

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Vérifiez l'installation :
```bash
node -v
npm -v
```

### Étape 3 : Cloner et Installer l'application

Naviguez vers le dossier web et clonez le projet (remplacez l'URL par celle de votre dépôt) :

```bash
cd /var/www
sudo git clone https://votre-repo-git/andorya-dashboard.git
cd andorya-dashboard
```

Installez les dépendances :
```bash
sudo npm install
```

### Étape 4 : Configuration et Build

Créez un fichier `.env` pour votre configuration :

```bash
sudo nano .env
```

Ajoutez votre clé API Gemini :
```env
API_KEY=votre_clé_api_google_gemini_ici
```

Compilez l'application pour la production :
```bash
sudo npm run build
```
*Cela créera un dossier `dist/` contenant les fichiers statiques optimisés.*

### Étape 5 : Configurer Nginx

Créez une configuration Nginx pour le dashboard :

```bash
sudo nano /etc/nginx/sites-available/andorya
```

Copiez la configuration suivante :

```nginx
server {
    listen 80;
    server_name votre-domaine.com ou_votre_ip;

    root /var/www/andorya-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

Activez le site et redémarrez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/andorya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 6 : Permissions

Assurez-vous que Nginx peut lire les fichiers :

```bash
sudo chown -R www-data:www-data /var/www/andorya-dashboard/dist
sudo chmod -R 755 /var/www/andorya-dashboard/dist
```

🎉 **Votre dashboard est accessible sur `http://votre-ip` !**

---

## 🐳 Méthode 2 : Installation via Docker

Si vous préférez exécuter le dashboard lui-même dans un conteneur.

### Étape 1 : Installer Docker (si ce n'est pas fait)

```bash
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### Étape 2 : Créer le Dockerfile

À la racine du projet, créez un fichier `Dockerfile` :

```dockerfile
# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Remplacez par votre clé ou passez-la en ARG
ENV API_KEY=votre_cle_api_ici 
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configuration Nginx pour le support SPA (React Router)
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 3 : Construire et Lancer

```bash
# Construire l'image
sudo docker build -t andorya-dashboard .

# Lancer le conteneur (Port 8080 par exemple)
sudo docker run -d -p 8080:80 --name andorya andorya-dashboard
```

Le dashboard sera accessible sur `http://votre-ip:8080`.

---

## 🔐 Sécurisation (HTTPS avec Certbot)

Pour la méthode Nginx, il est fortement recommandé d'activer le HTTPS.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

Suivez les instructions à l'écran pour rediriger automatiquement le trafic HTTP vers HTTPS.

---

## ℹ️ Note Importante

Actuellement, cette version de **Andorya Dashboard** fonctionne en **mode simulation/démo** (les données des conteneurs sont simulées dans le navigateur).

Pour connecter ce dashboard à votre véritable socket Docker (`/var/run/docker.sock`), une API Backend (Node.js/Express ou Go) sera nécessaire pour faire le pont entre ce frontend React et votre système Ubuntu.
