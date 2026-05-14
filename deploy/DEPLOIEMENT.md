# Guide de Déploiement — Adil Smart Store
## Hostinger Premium · Node.js (hPanel)

---

## Avant de commencer — Base de données PostgreSQL gratuite

Hostinger Premium inclut MySQL, mais notre application utilise PostgreSQL.
**Solution : créer une base PostgreSQL gratuite sur Neon.tech (5 minutes).**

### Étape 0 — Créer la base de données PostgreSQL (Neon.tech gratuit)

1. Allez sur **https://neon.tech** → cliquez "Sign Up" (gratuit, pas de carte bancaire)
2. Créez un projet → nommez-le `adil-smart-store`
3. Une fois créé, cliquez sur **"Connection string"**
4. Copiez la chaîne qui ressemble à :
   ```
   postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. **Gardez-la**, vous en aurez besoin à l'étape 3.

---

## Étape 1 — Uploader les fichiers sur Hostinger

### Via le File Manager hPanel (recommandé)

1. Connectez-vous sur **hPanel → Websites → Gérer**
2. Allez dans **Files → File Manager**
3. Naviguez vers le dossier de votre application Node.js
   *(généralement `/home/votre-user/domains/votre-domaine.com/` ou le dossier configuré dans Node.js Manager)*
4. Supprimez le contenu existant si besoin
5. Uploadez le fichier **`adil-smart-store-hostinger.zip`**
6. Faites un clic droit → **Extract** pour extraire le contenu
7. Assurez-vous que le contenu du dossier `deploy/` est à la racine du dossier de l'app

La structure attendue dans votre dossier d'application :
```
/votre-dossier-app/
├── dist/
│   ├── index.mjs          ← Point d'entrée principal
│   ├── pino-worker.mjs
│   ├── pino-file.mjs
│   ├── pino-pretty.mjs
│   ├── thread-stream-worker.mjs
│   └── public/            ← Site web (HTML, CSS, JS)
│       ├── index.html
│       └── assets/
├── package.json
├── migrate.mjs
├── seed.mjs
└── .env.example
```

---

## Étape 2 — Configurer l'application Node.js dans hPanel

1. Dans hPanel → allez dans **Websites → Node.js**
   *(ou cherchez "Node.js" dans le menu)*
2. Cliquez sur **"Create Application"** (ou modifiez l'existante)
3. Configurez :

   | Paramètre | Valeur |
   |---|---|
   | **Node.js version** | 20.x (ou la plus récente disponible) |
   | **Application mode** | Production |
   | **Application root** | Le dossier où vous avez uploadé les fichiers |
   | **Application startup file** | `dist/index.mjs` |

4. Cliquez **Save / Create**

---

## Étape 3 — Configurer les variables d'environnement

Dans hPanel → Node.js → votre application → **Environment Variables** :

Ajoutez ces variables (une par une) :

| Nom | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(votre chaîne Neon.tech copiée à l'étape 0)* |
| `ADMIN_PASSWORD` | `adil2024` |

> Le `PORT` est géré automatiquement par Hostinger, pas besoin de le définir.

Cliquez **Save**.

---

## Étape 4 — Créer les tables et insérer les produits (via SSH)

Hostinger Premium inclut l'accès SSH. Connectez-vous :

```bash
ssh votre-user@votre-serveur.hostinger.com
# (ou utilisez le Terminal dans hPanel)
```

Naviguez vers votre dossier d'application :
```bash
cd ~/domains/votre-domaine.com/   # adapter selon votre config
```

Créez les tables :
```bash
node migrate.mjs
# → Vous devez voir : ✔ Migration terminée avec succès.
```

Insérez les 23 produits :
```bash
node seed.mjs
# → Vous devez voir tous les produits listés avec ✔
```

> **Si vous n'avez pas d'accès SSH**, vous pouvez aussi utiliser le terminal intégré dans hPanel (File Manager → Terminal).

---

## Étape 5 — Démarrer l'application

Dans hPanel → Node.js → votre application :
- Cliquez **"Start"** ou **"Restart"**
- Attendez quelques secondes
- Le statut doit passer à **Running** (vert)

---

## Étape 6 — Vérification

Ouvrez votre navigateur sur votre domaine :

| URL | Attendu |
|---|---|
| `https://votre-domaine.com` | Page d'accueil Adil Smart Store |
| `https://votre-domaine.com/boutique` | Les 23 produits |
| `https://votre-domaine.com/contact` | Page contact + Google Maps |
| `https://votre-domaine.com/admin` | Dashboard admin (mot de passe: `adil2024`) |
| `https://votre-domaine.com/api/healthz` | `{"status":"ok"}` |

---

## Mise à jour du site (après modifications)

1. Téléchargez le nouveau ZIP depuis Replit
2. Uploadez-le dans le dossier de l'app via File Manager
3. Extrayez en écrasant les fichiers existants
4. Dans hPanel → Node.js → cliquez **Restart**

> Le seed n'est à relancer que si vous voulez réinitialiser tous les produits.
> Les données que vous avez ajoutées via l'admin `/admin` sont préservées.

---

## Résolution des problèmes

**L'app affiche une erreur 500 :**
- Vérifiez que `DATABASE_URL` est bien configurée dans les env variables
- Testez la connexion Neon.tech depuis leur dashboard

**L'app ne démarre pas :**
- Vérifiez que le startup file est bien `dist/index.mjs`
- Vérifiez que la version Node.js est 20+

**Les produits n'apparaissent pas :**
- Relancez `node migrate.mjs` puis `node seed.mjs` via SSH/Terminal

**Erreur SSL PostgreSQL :**
- Assurez-vous que votre DATABASE_URL se termine par `?sslmode=require`
