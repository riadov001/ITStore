/**
 * Build script for Hostinger deployment.
 * Produces a single self-contained folder: deploy/
 *   deploy/dist/index.mjs      → Express server (bundled by esbuild)
 *   deploy/dist/public/        → Built React frontend (from Vite)
 *   deploy/pm2.config.cjs      → PM2 process config
 *   deploy/nginx.conf          → Nginx reverse proxy config
 *   deploy/.env.example        → Environment variable template
 *   deploy/migrate.mjs         → DB migration runner
 *   deploy/seed.mjs            → DB seed runner
 *   deploy/DEPLOIEMENT.md      → Step-by-step deployment guide
 *
 * Usage:
 *   node scripts/build-deploy.mjs
 */

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DEPLOY_DIR = path.join(ROOT, "deploy");

function run(cmd, opts = {}) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT, ...opts });
}

function step(msg) {
  console.log(`\n${"─".repeat(60)}\n  ${msg}\n${"─".repeat(60)}`);
}

// ── 0. Clean ──────────────────────────────────────────────────────────────────
step("0/5  Nettoyage du dossier deploy/");
rmSync(DEPLOY_DIR, { recursive: true, force: true });
mkdirSync(DEPLOY_DIR, { recursive: true });

// ── 1. Build React frontend (Vite) ────────────────────────────────────────────
step("1/5  Build du frontend React (Vite)");
run(
  "pnpm --filter @workspace/adil-smart-store run build",
  {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
      BASE_PATH: "/",
    },
  }
);

// ── 2. Build Express API server (esbuild) ─────────────────────────────────────
step("2/5  Build du serveur API Express (esbuild)");
run("pnpm --filter @workspace/api-server run build", {
  env: { ...process.env, NODE_ENV: "production" },
});

// ── 3. Copy artefacts into deploy/ ───────────────────────────────────────────
step("3/5  Copie des fichiers dans deploy/");

// API server bundle → deploy/dist/
const apiDist = path.join(ROOT, "artifacts/api-server/dist");
const deployDist = path.join(DEPLOY_DIR, "dist");
cpSync(apiDist, deployDist, { recursive: true });

// React build → deploy/dist/public/
const frontendDist = path.join(ROOT, "artifacts/adil-smart-store/dist/public");
const deployPublic = path.join(deployDist, "public");
if (existsSync(frontendDist)) {
  cpSync(frontendDist, deployPublic, { recursive: true });
  console.log("  ✔ Frontend copié dans dist/public/");
} else {
  console.error("  ✗ ERREUR: dist/public/ introuvable — le build Vite a échoué.");
  process.exit(1);
}

// ── 4. Copy config files ──────────────────────────────────────────────────────
step("4/5  Copie des fichiers de configuration");

const configFiles = [
  ["deploy-config/pm2.config.cjs",    "pm2.config.cjs"],
  ["deploy-config/nginx.conf",        "nginx.conf"],
  ["deploy-config/.env.example",      ".env.example"],
  ["deploy-config/migrate.mjs",       "migrate.mjs"],
  ["deploy-config/seed.mjs",          "seed.mjs"],
  ["deploy-config/DEPLOIEMENT.md",    "DEPLOIEMENT.md"],
];

for (const [src, dest] of configFiles) {
  const srcPath = path.join(ROOT, src);
  const destPath = path.join(DEPLOY_DIR, dest);
  if (existsSync(srcPath)) {
    cpSync(srcPath, destPath);
    console.log(`  ✔ ${dest}`);
  } else {
    console.warn(`  ⚠ ${src} introuvable, ignoré`);
  }
}

// ── 5. Create deploy/package.json (minimal, for PM2) ─────────────────────────
step("5/5  Création du package.json de déploiement");

const deployPkg = {
  name: "adil-smart-store",
  version: "1.0.0",
  type: "module",
  engines: { node: ">=20" },
  scripts: {
    start: "node --enable-source-maps dist/index.mjs",
    migrate: "node migrate.mjs",
    seed: "node seed.mjs",
  },
};

writeFileSync(
  path.join(DEPLOY_DIR, "package.json"),
  JSON.stringify(deployPkg, null, 2)
);
console.log("  ✔ package.json créé");

// ── Done ──────────────────────────────────────────────────────────────────────
console.log(`
${"═".repeat(60)}
  BUILD TERMINÉ
  Dossier prêt : deploy/
  
  Contenu :
    dist/index.mjs         → Serveur Express complet
    dist/public/           → Frontend React (statique)
    pm2.config.cjs         → Config PM2
    nginx.conf             → Config Nginx
    .env.example           → Variables d'environnement
    migrate.mjs            → Migration base de données
    seed.mjs               → Données initiales
    DEPLOIEMENT.md         → Guide étape par étape
${"═".repeat(60)}
`);
