/**
 * Script de données initiales (seed) — Adil Smart Store
 * Insère les catégories et les 23 produits avec vraies photos.
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
  { name: "Smartwatches",        slug: "smartwatch", icon: "⌚" },
  { name: "Écouteurs & Earbuds", slug: "earbuds",    icon: "🎧" },
  { name: "Chargeurs",           slug: "charger",    icon: "⚡" },
  { name: "Câbles",              slug: "cable",      icon: "🔌" },
  { name: "Powerbanks",          slug: "powerbank",  icon: "🔋" },
  { name: "Coques & Protection", slug: "coque",      icon: "📱" },
];

const products = [
  // ─── SMARTWATCHES ─────────────────────────────────────────────
  {
    name: "Itel Smart Watch Fit O20 / O23",
    slug: "itel-fit-o20",
    brand: "Itel",
    category: "smartwatch",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Montre connectée haut de gamme avec écran HD tactile, appels Bluetooth, suivi santé complet (cardiaque, sommeil, SpO2, sport), résistance IP68 et autonomie exceptionnelle.",
    specs: { "Écran": "2.04\" HD AMOLED", "Batterie": "Jusqu'à 7 jours", "Étanchéité": "IP68", "Connectivité": "Bluetooth 5.3", "Fonctions": "Appels, Notifications, Sport" },
    variants: ["Noir", "Argent", "Rose Gold"],
  },
  {
    name: "Oraimo Watch 2 Ultra AMOLED",
    slug: "oraimo-watch-2-ultra",
    brand: "Oraimo",
    category: "smartwatch",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545579133-99bb5ad189be?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Montre intelligente premium avec écran AMOLED 1.96\", GPS intégré, suivi santé avancé et design sportif élégant. Autonomie jusqu'à 10 jours.",
    specs: { "Écran": "1.96\" AMOLED", "Batterie": "Jusqu'à 10 jours", "Étanchéité": "IP68", "GPS": "Intégré", "Modes sport": "100+" },
    variants: ["Noir", "Orange"],
  },
  {
    name: "Xiaomi Band 9 Pro AMOLED",
    slug: "xiaomi-band-9-pro",
    brand: "Xiaomi",
    category: "smartwatch",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545579133-99bb5ad189be?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Bracelet connecté premium avec écran AMOLED ultra-bright, suivi santé avancé (SpO2, fréquence cardiaque), 14 jours d'autonomie et résistance à l'eau 5ATM. Compatible iOS et Android.",
    specs: { "Écran": "AMOLED 1.74\"", "Autonomie": "14 jours", "Étanchéité": "5ATM", "GPS": "Intégré", "Capteurs": "SpO2, FC, Stress" },
    variants: ["Noir Minuit", "Or Rose", "Bleu Arctic"],
  },
  {
    name: "Itel Smart Watch Crown Pro",
    slug: "itel-crown-pro",
    brand: "Itel",
    category: "smartwatch",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Montre connectée avec boîtier en alliage zinc premium, écran IPS HD couleur, 100+ modes sport, appels Bluetooth intégrés et notifications intelligentes.",
    specs: { "Écran": "IPS 1.85\"", "Autonomie": "7 jours", "Appels": "Bluetooth", "Modes sport": "100+", "Étanchéité": "IP67" },
    variants: ["Noir", "Argent", "Or"],
  },
  {
    name: "Huawei Band 9 Sport Edition",
    slug: "huawei-band-9",
    brand: "Huawei",
    category: "smartwatch",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Bracelet connecté ultra-fin (6.99mm) avec écran AMOLED, 100 modes d'entraînement, suivi sommeil avancé et 14 jours d'autonomie. Charge rapide magnétique.",
    specs: { "Écran": "AMOLED 1.47\"", "Épaisseur": "6.99mm", "Autonomie": "14 jours", "Sports": "100 modes", "Charge": "Magnétique" },
    variants: ["Noir Graphite", "Blanc Nacre", "Vert Forêt"],
  },

  // ─── ÉCOUTEURS ────────────────────────────────────────────────
  {
    name: "Soundpeats Air 4 Pro",
    slug: "soundpeats-air-4-pro",
    brand: "Soundpeats",
    category: "earbuds",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588423771073-b8903febb85d?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Écouteurs sans fil premium avec réduction de bruit active, son immersif Hi-Res et autonomie jusqu'à 30h avec boîtier. Bluetooth 5.3, charge USB-C rapide.",
    specs: { "Autonomie": "9h + 21h boîtier", "ANC": "Active Hi-Res", "Charge": "USB-C rapide", "Bluetooth": "5.3", "Codecs": "AAC, SBC, LDAC" },
    variants: ["Noir", "Blanc", "Bleu"],
  },
  {
    name: "Xiaomi Redmi Buds 6 Pro",
    slug: "xiaomi-redmi-buds-6-pro",
    brand: "Xiaomi",
    category: "earbuds",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1632634557508-84e22c3efdf1?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Écouteurs haut de gamme Xiaomi avec ANC intelligent jusqu'à 48dB, son Hi-Res certifié, autonomie 36h et Bluetooth 5.4 ultra-stable.",
    specs: { "Autonomie": "10h + 26h", "ANC": "48dB", "Bluetooth": "5.4", "Certification": "Hi-Res", "Modes": "Transparence, ANC, Normal" },
    variants: ["Noir", "Blanc"],
  },
  {
    name: "Baseus Bowie MA10 Pro ANC",
    slug: "baseus-bowie-ma10-pro",
    brand: "Baseus",
    category: "earbuds",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Écouteurs intra-auriculaires avec réduction de bruit active -43dB, driver dynamique 12mm, son Hi-Res certifié. Connexion multi-points Bluetooth 5.3.",
    specs: { "ANC": "-43dB", "Driver": "12mm dynamique", "Autonomie": "9h + 27h boîtier", "Bluetooth": "5.3", "Certification": "Hi-Res Audio" },
    variants: ["Blanc Perle", "Noir Onyx"],
  },
  {
    name: "Oraimo FreePods 4C",
    slug: "oraimo-freepods-4c",
    brand: "Oraimo",
    category: "earbuds",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1588423771073-b8903febb85d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Écouteurs sans fil Bluetooth 5.3, ENC 4 micros pour appels cristallins, driver Titanium 10mm et contrôles tactiles avancés.",
    specs: { "Driver": "Titanium 10mm", "Micros": "4 ENC", "Autonomie": "7h + 21h", "Bluetooth": "5.3", "Résistance": "IPX5" },
    variants: ["Blanc", "Noir"],
  },
  {
    name: "Ugreen HiTune T3 ANC",
    slug: "ugreen-hitune-t3-anc",
    brand: "Ugreen",
    category: "earbuds",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1632634557508-84e22c3efdf1?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Écouteurs ANC hybride 4 micros, mode transparence naturelle, driver 10mm son spatial 3D. Charge rapide : 10 min = 2h d'écoute.",
    specs: { "ANC": "Hybride 4 micros", "Driver": "10mm", "Autonomie": "8h + 22h", "Charge rapide": "10min → 2h", "Mode": "Transparence" },
    variants: ["Noir", "Blanc"],
  },

  // ─── CHARGEURS ────────────────────────────────────────────────
  {
    name: "Chargeur Xiaomi 65W GaN Original",
    slug: "chargeur-xiaomi-65w-gan",
    brand: "Xiaomi",
    category: "charger",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Chargeur rapide original Xiaomi 65W GaN, compatible tous smartphones (iPhone, Samsung, Xiaomi, etc.). 2x USB-C + 1x USB-A.",
    specs: { "Puissance": "65W", "Ports": "2x USB-C + 1x USB-A", "Technologie": "GaN", "Protocoles": "PD 3.0, QC 4+" },
    variants: ["Blanc", "Noir"],
  },
  {
    name: "Samsung 45W Super Fast Charging Original",
    slug: "samsung-45w-original",
    brand: "Samsung",
    category: "charger",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Chargeur original Samsung 45W Super Fast Charging 3.0 avec protection thermique intelligente. Compatible Galaxy S24, S23, S22 et tous appareils USB-C PD.",
    specs: { "Puissance": "45W", "Technologie": "Super Fast 3.0", "Connecteur": "USB-C", "Protection": "Thermique + surcharge", "Compatibilité": "Galaxy + USB-C PD" },
    variants: ["Blanc", "Noir"],
  },
  {
    name: "Baseus GaN 100W 4 Ports",
    slug: "baseus-gan-100w-4ports",
    brand: "Baseus",
    category: "charger",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Chargeur GaN ultra-compact 100W avec 2 USB-C + 2 USB-A, charge simultanée de 4 appareils. Technologie GaN III, chaleur réduite de 40%.",
    specs: { "Puissance": "100W total", "Ports": "2 USB-C + 2 USB-A", "Technologie": "GaN III", "Format": "Ultra-compact" },
    variants: ["Blanc", "Noir"],
  },
  {
    name: "Xiaomi HyperCharge 120W",
    slug: "xiaomi-hypercharge-120w",
    brand: "Xiaomi",
    category: "charger",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Chargeur Xiaomi HyperCharge 120W — charge de 0 à 100% en 19 minutes. Protocoles QC 5.0, PD 3.0, AFC, VOOC. 9 niveaux de protection.",
    specs: { "Puissance": "120W", "Protocoles": "QC5 + PD3 + VOOC", "Charge complète": "19 min", "Protections": "9 niveaux" },
    variants: ["Blanc"],
  },

  // ─── CÂBLES ───────────────────────────────────────────────────
  {
    name: "Câble iPhone 16 Pro Max Original Apple",
    slug: "cable-iphone-16-pro-max",
    brand: "Apple",
    category: "cable",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Câble USB-C vers USB-C original Apple haute qualité pour iPhone 16 Series. Charge rapide 60W, transfert données rapide.",
    specs: { "Longueur": "1m / 2m", "Puissance": "60W", "Compatibilité": "iPhone 16 / 15 Pro / Mac", "Certification": "MFi Apple" },
    variants: ["Blanc 1m", "Blanc 2m"],
  },
  {
    name: "Câble USB-C 240W Tressé Nylon",
    slug: "cable-usbc-240w-tresse",
    brand: "Baseus",
    category: "cable",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Câble USB-C 240W en nylon tressé haute résistance, USB4 40Gbps, vidéo 8K@60Hz. Certifié USB-IF. Testé à 30 000 courbures.",
    specs: { "Puissance": "240W", "Données": "40Gbps USB4", "Vidéo": "8K@60Hz", "Matière": "Nylon tressé", "Certification": "USB-IF" },
    variants: ["Noir 1m", "Noir 2m", "Blanc 1m"],
  },
  {
    name: "Câble Samsung USB-C Original EP-DA705",
    slug: "cable-samsung-original-25w",
    brand: "Samsung",
    category: "cable",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Câble Samsung USB-C original EP-DA705 compatible Super Fast Charging 25W. Certification Samsung officielle, extrémités renforcées.",
    specs: { "Puissance": "25W", "Longueur": "1m", "Certification": "Samsung Official", "Construction": "Renforcée" },
    variants: ["Blanc", "Noir"],
  },

  // ─── POWERBANKS ───────────────────────────────────────────────
  {
    name: "Powerbank Ugreen 20000mAh 65W PD",
    slug: "ugreen-powerbank-20000",
    brand: "Ugreen",
    category: "powerbank",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Batterie externe ultra-rapide 65W PD compatible tous appareils. 3 sorties simultanées, recharge interne en 2h via USB-C 65W.",
    specs: { "Capacité": "20000mAh", "Puissance": "65W PD", "Ports": "2 USB-C + 1 USB-A", "Recharge interne": "2h" },
    variants: ["Noir", "Gris"],
  },
  {
    name: "Baseus Blade 100W 20000mAh",
    slug: "baseus-blade-100w",
    brand: "Baseus",
    category: "powerbank",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Powerbank ultra-plat (13.5mm épaisseur) avec 100W de charge rapide. 2 USB-C + 1 USB-A, compatible MacBook. Recharge complète de la batterie interne en 1h30.",
    specs: { "Capacité": "20000mAh", "Puissance": "100W max", "Épaisseur": "13.5mm", "Ports": "2 USB-C + 1 USB-A", "Recharge interne": "1h30" },
    variants: ["Noir", "Blanc"],
  },

  // ─── COQUES & PROTECTION ──────────────────────────────────────
  {
    name: "Coque iPhone 16 Pro Max MagSafe Cuir",
    slug: "coque-iphone-16-pro-max-magsafe",
    brand: "Apple",
    category: "coque",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Coque premium MagSafe en cuir véritable pour iPhone 16 Pro Max. Protection militaire, recharge sans fil préservée, finition luxe.",
    specs: { "Protection": "Militaire MIL-STD", "Finition": "Cuir premium", "Compatible": "MagSafe 15W", "Sans fil": "Oui" },
    variants: ["Noir", "Marron", "Bleu Navy"],
  },
  {
    name: "Coque Samsung Galaxy S24 Ultra Armor",
    slug: "coque-samsung-s24-ultra",
    brand: "Samsung",
    category: "coque",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Coque protection militaire MIL-STD-810G pour Samsung Galaxy S24 Ultra. Double couche PC + TPU, coins renforcés, MagSafe compatible.",
    specs: { "Compatibilité": "Galaxy S24 Ultra", "Norme": "MIL-STD-810G", "Matière": "PC + TPU double", "MagSafe": "Compatible" },
    variants: ["Noir Mat", "Bleu Titane", "Vert Kaki", "Transparent"],
  },
  {
    name: "Verre Trempé iPhone 16 Pro Max 9H Anti-Reflet",
    slug: "verre-trempe-iphone16promax",
    brand: "Baseus",
    category: "coque",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Protection écran verre trempé 9H avec revêtement anti-reflet oleophobe, bords 2.5D incurvés. Kit de pose inclus. Compatible Face ID.",
    specs: { "Compatibilité": "iPhone 16 Pro Max", "Dureté": "9H", "Revêtement": "Anti-reflet oléophobe", "Bords": "2.5D", "Épaisseur": "0.33mm" },
    variants: ["Transparent", "Anti-espion"],
  },
  {
    name: "Support Voiture MagSafe 15W",
    slug: "support-voiture-magsafe-15w",
    brand: "Ugreen",
    category: "coque",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
    ],
    description: "Support voiture avec charge sans fil MagSafe 15W intégré. Rotation 360°, aimants N52 ultra-puissants. Compatible iPhone 12 et supérieur.",
    specs: { "Charge": "15W MagSafe", "Fixation": "Tableau de bord / Grille", "Rotation": "360°", "Aimants": "N52", "Compatible": "iPhone 12+" },
    variants: ["Noir"],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("━━━ Adil Smart Store — Seed ━━━\n");

    console.log("📂 Insertion des catégories...");
    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, cat.icon]
      );
      console.log(`  ✔ ${cat.name}`);
    }

    console.log("\n📦 Insertion des produits...");
    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, slug, brand, category, images, description, specs, featured, variants, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, NOW(), NOW())
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           brand = EXCLUDED.brand,
           images = EXCLUDED.images,
           description = EXCLUDED.description,
           specs = EXCLUDED.specs,
           featured = EXCLUDED.featured,
           variants = EXCLUDED.variants,
           updated_at = NOW()`,
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
      console.log(`  ✔ [${p.category.toUpperCase().padEnd(10)}] ${p.name}`);
    }

    console.log(`\n✅ Seed terminé — ${categories.length} catégories, ${products.length} produits.`);
  } catch (err) {
    console.error("✗ Erreur lors du seed :", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
