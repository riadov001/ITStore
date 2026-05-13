# Guide de Déploiement — Adil Smart Store sur Hostinger VPS

## Prérequis sur Hostinger

- VPS Hostinger (Ubuntu 22.04 recommandé) — Plan KVM 2 minimum
- Accès SSH root ou sudo
- Un nom de domaine pointant vers l'IP de votre VPS (ex: adilsmartstore.ma)

---

## Étape 1 — Préparer le serveur (une seule fois)

Connectez-vous en SSH à votre VPS :

```bash
ssh root@VOTRE_IP_VPS
```

### 1.1 Mettre à jour le système

```bash
apt update && apt upgrade -y
```

### 1.2 Installer Node.js 20 (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node --version   # doit afficher v20.x.x
```

### 1.3 Installer PM2 (gestionnaire de processus)

```bash
npm install -g pm2
```

### 1.4 Installer Nginx

```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

### 1.5 Installer PostgreSQL

```bash
apt install postgresql postgresql-contrib -y
systemctl enable postgresql
systemctl start postgresql
```

### 1.6 Créer la base de données PostgreSQL

```bash
sudo -u postgres psql
```

Dans le terminal PostgreSQL, tapez :

```sql
CREATE USER adilstore_user WITH PASSWORD 'VotreMotDePasseFort123';
CREATE DATABASE adilstore_db OWNER adilstore_user;
GRANT ALL PRIVILEGES ON DATABASE adilstore_db TO adilstore_user;
\q
```

---

## Étape 2 — Transférer les fichiers

Sur votre ordinateur local, compressez le dossier `deploy/` en ZIP :

**Méthode A — Via FTP (FileZilla)**
1. Connectez-vous à votre VPS via SFTP dans FileZilla
2. Naviguez vers `/var/www/`
3. Glissez-déposez le dossier `deploy/` → il devient `/var/www/adilsmartstore/`

**Méthode B — Via terminal (SCP)**
```bash
# Sur votre ordinateur local :
scp -r deploy/ root@VOTRE_IP_VPS:/var/www/adilsmartstore
```

**Méthode C — Via Hostinger File Manager**
1. Compressez `deploy/` en `deploy.zip`
2. Uploadez via le File Manager du hPanel Hostinger
3. Extrayez dans `/var/www/adilsmartstore/`

---

## Étape 3 — Configurer les variables d'environnement

Sur le serveur, naviguez vers le dossier :

```bash
cd /var/www/adilsmartstore
```

Copiez le fichier d'exemple et éditez-le :

```bash
cp .env.example .env
nano .env
```

Remplissez les valeurs :

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://adilstore_user:VotreMotDePasseFort123@localhost:5432/adilstore_db
SESSION_SECRET=générez-une-clé-aléatoire-ici
```

Pour générer une clé SESSION_SECRET :
```bash
openssl rand -base64 32
```

Sauvegardez avec `CTRL+O`, quittez avec `CTRL+X`.

---

## Étape 4 — Migrer la base de données

Créez les tables dans la base de données :

```bash
cd /var/www/adilsmartstore
node migrate.mjs
```

Vous devez voir : `✔ Migration terminée avec succès.`

---

## Étape 5 — Insérer les données initiales (produits)

```bash
node seed.mjs
```

Vous devez voir tous les produits insérés avec `✔`.

> Si vous avez déjà des données et ne voulez pas repartir de zéro, passez cette étape.

---

## Étape 6 — Démarrer l'application avec PM2

```bash
cd /var/www/adilsmartstore

# Charger le fichier .env dans PM2
export $(cat .env | grep -v '^#' | xargs)

# Démarrer l'application
pm2 start pm2.config.cjs --env production

# Sauvegarder la config PM2 (redémarrage automatique après reboot)
pm2 save
pm2 startup
```

Suivez l'instruction affichée par `pm2 startup` (une commande à copier-coller).

Vérifier que l'application tourne :

```bash
pm2 status
pm2 logs adil-smart-store
```

Vous devez voir : `Server listening port=3000`

---

## Étape 7 — Configurer Nginx (proxy)

```bash
# Copier la configuration Nginx
cp /var/www/adilsmartstore/nginx.conf /etc/nginx/sites-available/adilsmartstore

# Éditez le fichier pour remplacer "votre-domaine.com" par votre vrai domaine
nano /etc/nginx/sites-available/adilsmartstore
```

Remplacez `votre-domaine.com` par votre domaine réel, puis :

```bash
# Activer le site
ln -s /etc/nginx/sites-available/adilsmartstore /etc/nginx/sites-enabled/

# Désactiver le site par défaut (optionnel)
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl reload nginx
```

---

## Étape 8 — Activer HTTPS (SSL gratuit Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Suivez les instructions. Certbot configure HTTPS automatiquement.

Renouvellement automatique (déjà activé par certbot, vérifiez) :

```bash
certbot renew --dry-run
```

---

## Étape 9 — Vérification finale

Ouvrez votre navigateur et allez sur :
- `https://votre-domaine.com` → Page d'accueil du store
- `https://votre-domaine.com/boutique` → Boutique
- `https://votre-domaine.com/admin` → Admin (mot de passe: `adil2024`)
- `https://votre-domaine.com/api/healthz` → Doit retourner `{"status":"ok"}`

---

## Commandes utiles au quotidien

| Action | Commande |
|--------|---------|
| Voir l'état de l'app | `pm2 status` |
| Voir les logs en direct | `pm2 logs adil-smart-store` |
| Redémarrer l'app | `pm2 restart adil-smart-store` |
| Arrêter l'app | `pm2 stop adil-smart-store` |
| Vérifier Nginx | `nginx -t` |
| Recharger Nginx | `systemctl reload nginx` |
| Vérifier PostgreSQL | `systemctl status postgresql` |

---

## Mise à jour du site (après modifications)

1. Sur votre ordinateur, relancez le build : `node scripts/build-deploy.mjs`
2. Transférez le nouveau dossier `deploy/` sur le VPS
3. Redémarrez l'app : `pm2 restart adil-smart-store`

---

## Résolution des problèmes

**L'app ne démarre pas :**
```bash
pm2 logs adil-smart-store --lines 50
```

**Erreur de connexion à la base de données :**
```bash
# Vérifiez la DATABASE_URL dans .env
# Testez la connexion :
psql postgresql://adilstore_user:VOTRE_MOT_DE_PASSE@localhost:5432/adilstore_db
```

**Erreur 502 Bad Gateway (Nginx) :**
```bash
# Vérifiez que l'app tourne sur le port 3000
pm2 status
curl http://localhost:3000/api/healthz
```

**Port 3000 déjà utilisé :**
```bash
lsof -i :3000
kill -9 PID_DU_PROCESSUS
```
