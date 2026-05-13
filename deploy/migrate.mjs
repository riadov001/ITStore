/**
 * Script de migration de la base de données.
 * Crée toutes les tables nécessaires au premier démarrage.
 *
 * Usage : node migrate.mjs
 */

import pg from "pg";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Charger .env si présent
const envFile = path.join(__dirname, ".env");
if (existsSync(envFile)) {
  const lines = readFileSync(envFile, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("ERREUR : DATABASE_URL n'est pas définie dans .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  `
  CREATE TABLE IF NOT EXISTS categories (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        TEXT      NOT NULL,
    slug        TEXT      NOT NULL UNIQUE,
    brand       TEXT      NOT NULL,
    category    TEXT      NOT NULL,
    images      TEXT[]    NOT NULL DEFAULT '{}',
    description TEXT      NOT NULL,
    specs       JSONB              DEFAULT '{}',
    featured    BOOLEAN   NOT NULL DEFAULT false,
    variants    TEXT[]    NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `,
];

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Connexion à la base de données...");
    for (const sql of migrations) {
      await client.query(sql);
    }
    console.log("✔ Migration terminée avec succès.");
  } catch (err) {
    console.error("✗ Erreur lors de la migration :", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
