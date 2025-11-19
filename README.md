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

## ⚙️ Architecture (Backend vs Frontend)

**L'application ne fonctionne PAS en mode autonome.**
Puisque c'est une interface web (React), elle a besoin d'un **Backend** pour lire les informations de Docker sur votre serveur.

Il y a donc **2 parties** à lancer :
1.  **Le Backend (API)** : Un petit script Node.js sur le port 3001 qui parle à Docker.
2.  **Le Frontend (Dashboard)** : L'interface visuelle sur le port 80 (Nginx) ou 8080 (Docker).

### 1. Installation du Backend (Obligatoire)

Sur votre serveur, installez les dépendances et créez le script API :

1.  Installez les modules nécessaires :
    ```bash
    mkdir backend && cd backend
    npm init -y
    npm install express cors dockerode systeminformation
    ```

2.  Créez un fichier `server.js` dans ce dossier :
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

3.  **Lancer le Backend en tâche de fond** (avec PM2 pour qu'il reste allumé) :
    ```bash
    sudo npm install -g pm2
    pm2 start server.js --name "andorya-backend"
    pm2 save
    pm2 startup
    ```

---

## 🛠️ Méthode 1 : Installation du Frontend (Classique Nginx)

Cette méthode est recommandée pour les performances.

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

### Étape 3 : Cloner et Installer l'application

Naviguez vers le dossier web et clonez le projet :

```bash
cd /var/www
sudo git clone https://github.com/Dj-tim78/dashboard.git
cd dashboard
```

Installez les dépendances :
```bash
sudo npm install
```

### Étape 4 : Build

Assurez-vous que votre fichier `.env` est créé avec la clé API.

```bash
sudo npm run build
```

### Étape 5 : Configurer Nginx

Créez une configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/andorya
```

Collez la configuration :

```nginx
server {
    listen 80;
    server_name votre-ip-ou-domaine;

    root /var/www/dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Activez le site et redémarrez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/andorya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🐳 Méthode 2 : Installation du Frontend (Docker)

### Étape 1 : Créer le Dockerfile

À la racine du projet :

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV API_KEY=votre_cle_api_ici 
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 2 : Lancer

```bash
sudo docker build -t dashboard .
sudo docker run -d -p 8080:80 --name andorya dashboard
```

Accès : `http://votre-ip:8080`

---

## 👤 Accès et Identifiants

Accédez à `http://votre-ip` (ou port 8080).

| Rôle | Utilisateur | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin` |
| **Viewer** | `viewer` | `view` |

---

## ✅ Vérification Finale : Est-ce que tout fonctionne ?

Une fois l'installation terminée, voici la **check-list** pour valider le déploiement :

1.  **Test du Backend** :
    Sur le serveur, lancez : `curl http://localhost:3001/api/stats`
    *   *Succès* : Vous recevez un JSON avec `{cpu: ..., memory: ...}`.
    *   *Échec* : Vérifiez que `server.js` tourne (`pm2 status`) et que le port 3001 est libre.

2.  **Test de l'Affichage** :
    Connectez-vous au dashboard.
    *   *Succès* : Vous voyez vos conteneurs actuels et les graphiques bougent.
    *   *Échec (Bannière Orange)* : Si vous voyez "Backend Unreachable", c'est que le navigateur n'arrive pas à joindre `http://localhost:3001`.
    *   **Note Importante** : Si vous accédez au dashboard depuis un autre PC, le frontend va chercher `localhost`. Vous devez modifier `App.tsx` avant le build pour remplacer `http://localhost:3001` par `http://IP-DU-SERVEUR:3001`, ou configurer un Proxy Nginx.

3.  **Test de l'IA (Gemini)** :
    Cliquez sur un conteneur -> Logs -> "Analyze with AI".
    *   *Succès* : Une analyse s'affiche à droite.
    *   *Échec* : Vérifiez votre clé API dans le `.env` ou le Dockerfile.
