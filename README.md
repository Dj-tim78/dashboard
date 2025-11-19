# 🚀 Andorya Dashboard - Guide d'Installation (Ubuntu Server)

Ce guide détaille les étapes pour déployer **Andorya Dashboard** sur un serveur Ubuntu en production.

## 📋 Prérequis

*   Un serveur **Ubuntu** (20.04, 22.04 ou plus récent).
*   Un accès **root** ou un utilisateur avec privilèges `sudo`.
*   Une clé API Google Gemini (pour l'analyse des logs).

## 🔑 Configuration de la Clé API Gemini

Ce dashboard utilise **Google Gemini** pour analyser les logs des conteneurs et proposer des solutions intelligentes. Pour que cette fonctionnalité soit active, vous devez configurer une clé API.

1.  **Obtenir une clé** : Rendez-vous sur [Google AI Studio](https://aistudio.google.com/) pour générer une clé API.
2.  **Fichier `.env`** : À la racine du projet (pour le développement local ou la méthode classique), créez un fichier nommé `.env`.
3.  **Définition de la variable** :
    Ouvrez le fichier et ajoutez la ligne suivante en remplaçant le texte générique par votre véritable clé :

    ```env
    API_KEY=votre_vraie_clé_api_ici
    ```

> **⚠️ Sécurité** : Ne partagez jamais votre fichier `.env`. Si vous utilisez Git, assurez-vous que `.env` est listé dans votre fichier `.gitignore` pour éviter de publier votre clé API accidentellement.

---

## ⚠️ IMPORTANT : Mode Simulation vs Vraies Données

**Par défaut, cette application fonctionne en mode "Simulation".**
C'est une application Frontend (React) qui tourne dans votre navigateur. Pour des raisons de sécurité, elle ne peut pas lire directement votre CPU, votre RAM ou vos conteneurs Docker.

### Comment afficher les VRAIES ressources de mon serveur ?

Pour connecter ce dashboard à votre serveur Linux réel, vous devez créer un petit serveur API (Backend) qui fera le pont entre React et Docker.

Voici le script `server.js` (Node.js) que vous devrez utiliser :

1.  Installez les bibliothèques nécessaires sur votre serveur :
    ```bash
    npm install express cors dockerode systeminformation
    ```

2.  Créez un fichier `server.js` à côté de votre dossier `dist` :
    ```javascript
    const express = require('express');
    const Docker = require('dockerode');
    const si = require('systeminformation');
    const cors = require('cors');
    
    const app = express();
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    
    app.use(cors()); // Autorise le frontend à parler au backend
    
    // Endpoint pour les conteneurs
    app.get('/api/containers', async (req, res) => {
        try {
            const containers = await docker.listContainers({ all: true });
            res.json(containers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Endpoint pour les métriques système (CPU/RAM)
    app.get('/api/stats', async (req, res) => {
        try {
            const cpu = await si.currentLoad();
            const mem = await si.mem();
            res.json({
                cpu: cpu.currentLoad,
                memory: mem.active,
                memoryTotal: mem.total
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    app.listen(3001, () => console.log('Backend running on port 3001'));
    ```

3.  Lancez ce serveur avec `node server.js`.
4.  Modifiez le code React (`App.tsx`) pour faire des `fetch('http://votre-ip:3001/api/containers')` au lieu d'utiliser `INITIAL_CONTAINERS`.

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
sudo git clone https://github.com/Dj-tim78/dashboard.git
cd dashboard
```

Installez les dépendances :
```bash
sudo npm install
```

### Étape 4 : Configuration et Build

Assurez-vous que votre fichier `.env` est créé comme décrit dans la section **Configuration** ci-dessus.

```bash
sudo nano .env
# Collez votre API_KEY=...
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

    root /var/www/dashboard/dist;
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
sudo chown -R www-data:www-data /var/www/dashboard/dist
sudo chmod -R 755 /var/www/dashboard/dist
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
# Remplacez par votre clé ou passez-la en ARG lors du build
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

## 👤 Accès et Identifiants

Une fois l'installation terminée, accédez simplement à l'adresse IP de votre serveur (`http://votre-ip`). L'application affichera automatiquement l'écran de connexion.

**Identifiants par défaut :**

| Rôle | Nom d'utilisateur | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin` | `admin` |
| **Visiteur (Lecture Seule)** | `viewer` | `view` |

> **Note :** Il est fortement recommandé de changer ces mots de passe une fois connecté via l'onglet "Users".
