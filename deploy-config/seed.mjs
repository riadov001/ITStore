/**
 * Script de données initiales (seed).
 * Insère les catégories et produits de démo.
 * Exécutez ce script UNE SEULE FOIS après la migration.
 *
 * Usage : node seed.mjs
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

const categories = [
  { name: "Smartwatches",       slug: "smartwatch", icon: "⌚" },
  { name: "Écouteurs & Earbuds", slug: "earbuds",    icon: "🎧" },
  { name: "Chargeurs",          slug: "charger",    icon: "⚡" },
  { name: "Câbles",             slug: "cable",      icon: "🔌" },
  { name: "Powerbanks",         slug: "powerbank",  icon: "🔋" },
  { name: "Coques & Protection", slug: "coque",      icon: "📱" },
];

const products = [
  {
    name: "Itel Smart Watch Fit O20 / O23",
    slug: "itel-fit-o20",
    brand: "Itel",
    category: "smartwatch",
    images: [
      "https://picsum.photos/id/1015/1200/1200",
      "https://picsum.photos/id/1016/1200/1200",
      "https://picsum.photos/id/106/1200/1200",
    ],
    description:
      "Montre connectée haut de gamme avec écran HD tactile, appels Bluetooth, suivi santé complet (cardiaque, sommeil, SpO2, sport), résistance IP68 et autonomie exceptionnelle.",
    specs: { Écran: '2.04" HD Amoled', Batterie: "Jusqu'à 7 jours", Étanche: "IP68", Connectivité: "Bluetooth 5.3", Fonctions: "Appels, Notifications, Sport" },
    featured: true,
    variants: ["Noir", "Argent", "Rose Gold"],
  },
  {
    name: "Soundpeats Air 4 Pro + Ugreen Earbuds",
    slug: "soundpeats-air-4-pro",
    brand: "Soundpeats",
    category: "earbuds",
    images: [
      "https://picsum.photos/id/201/1200/1200",
      "https://picsum.photos/id/202/1200/1200",
    ],
    description:
      "Écouteurs sans fil premium avec réduction de bruit active, son immersif Hi-Res et autonomie jusqu'à 30h avec boîtier.",
    specs: { Autonomie: "30h", "Réduction Bruit": "ANC Active", Charge: "USB-C rapide", Codecs: "AAC, SBC" },
    featured: true,
    variants: ["Noir", "Blanc", "Bleu"],
  },
  {
    name: "Chargeur Xiaomi 65W GaN Original",
    slug: "chargeur-xiaomi-65w-gan",
    brand: "Xiaomi",
    category: "charger",
    images: ["https://picsum.photos/id/180/1200/1200"],
    description: "Chargeur rapide original Xiaomi 65W GaN, compatible tous smartphones (iPhone, Samsung, Xiaomi, etc.).",
    specs: { Puissance: "65W", Ports: "2x USB-C + USB-A", Technologie: "GaN" },
    featured: false,
    variants: ["Blanc", "Noir"],
  },
  {
    name: "Câble iPhone 16 Pro Max Original Apple",
    slug: "cable-iphone-16-pro-max",
    brand: "Apple",
    category: "cable",
    images: ["https://picsum.photos/id/133/1200/1200"],
    description: "Câble USB-C vers Lightning original Apple haute qualité pour iPhone 16 Series.",
    specs: { Longueur: "1m / 2m", Compatibilité: "iPhone 16 / 15 / 14" },
    featured: false,
    variants: ["Blanc"],
  },
  {
    name: "Oraimo Watch 2 Ultra AMOLED",
    slug: "oraimo-watch-2-ultra",
    brand: "Oraimo",
    category: "smartwatch",
    images: ["https://picsum.photos/id/250/1200/1200"],
    description: "Montre intelligente premium avec écran AMOLED 1.96\", GPS intégré et design sportif élégant.",
    specs: { Écran: '1.96" AMOLED', Batterie: "Jusqu'à 10 jours", Étanche: "IP68" },
    featured: true,
    variants: ["Noir", "Orange"],
  },
  {
    name: "Xiaomi Redmi Buds 6 Pro",
    slug: "xiaomi-redmi-buds-6-pro",
    brand: "Xiaomi",
    category: "earbuds",
    images: ["https://picsum.photos/id/251/1200/1200"],
    description: "Écouteurs haut de gamme avec ANC intelligent jusqu'à 48dB et son Hi-Res.",
    specs: { Autonomie: "36h", ANC: "48dB", Bluetooth: "5.4" },
    featured: false,
    variants: ["Noir", "Blanc"],
  },
  {
    name: "Powerbank Ugreen 20000mAh 65W PD",
    slug: "ugreen-powerbank-20000",
    brand: "Ugreen",
    category: "powerbank",
    images: ["https://picsum.photos/id/48/1200/1200"],
    description: "Batterie externe ultra-rapide 65W compatible tous appareils.",
    specs: { Capacité: "20000mAh", Puissance: "65W PD", Ports: "3 sorties" },
    featured: false,
    variants: ["Noir", "Gris"],
  },
  {
    name: "Coque iPhone 16 Pro Max MagSafe Cuir",
    slug: "coque-iphone-16-pro-max-magsafe",
    brand: "Apple",
    category: "coque",
    images: ["https://picsum.photos/id/26/1200/1200"],
    description: "Coque premium MagSafe en cuir véritable pour iPhone 16 Pro Max.",
    specs: { Protection: "Militaire", Finition: "Cuir premium", Compatible: "MagSafe" },
    featured: false,
    variants: ["Noir", "Marron", "Bleu"],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Insertion des catégories...");
    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, cat.icon]
      );
      console.log(`  ✔ ${cat.name}`);
    }

    console.log("\nInsertion des produits...");
    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, slug, brand, category, images, description, specs, featured, variants)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`,
        [
          p.name,
          p.slug,
          p.brand,
          p.category,
          p.images,
          p.description,
          JSON.stringify(p.specs),
          p.featured,
          p.variants,
        ]
      );
      console.log(`  ✔ ${p.name}`);
    }

    console.log("\n✔ Seed terminé avec succès.");
  } catch (err) {
    console.error("✗ Erreur lors du seed :", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
