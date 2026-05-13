import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, sql, desc } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const parsed = ListProductsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const conditions = [];
    if (params.category) conditions.push(eq(productsTable.category, params.category));
    if (params.brand) conditions.push(eq(productsTable.brand, params.brand));
    if (params.search) conditions.push(ilike(productsTable.name, `%${params.search}%`));
    if (params.featured !== undefined) conditions.push(eq(productsTable.featured, params.featured));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const [products, countResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(whereClause)
        .orderBy(desc(productsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(productsTable)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    res.json({
      products: products.map(formatProduct),
      total,
    });
  } catch (err) {
    req.log.error({ err }, "Error listing products");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.featured, true))
      .orderBy(desc(productsTable.createdAt))
      .limit(8);
    res.json(products.map(formatProduct));
  } catch (err) {
    req.log.error({ err }, "Error listing featured products");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/products/stats", async (req, res) => {
  try {
    const [totalResult, featuredResult, byCategoryResult, byBrandResult, recentProducts] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(productsTable),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(productsTable)
          .where(eq(productsTable.featured, true)),
        db
          .select({ category: productsTable.category, count: sql<number>`count(*)::int` })
          .from(productsTable)
          .groupBy(productsTable.category)
          .orderBy(desc(sql`count(*)`)),
        db
          .select({ brand: productsTable.brand, count: sql<number>`count(*)::int` })
          .from(productsTable)
          .groupBy(productsTable.brand)
          .orderBy(desc(sql`count(*)`)),
        db
          .select()
          .from(productsTable)
          .orderBy(desc(productsTable.createdAt))
          .limit(5),
      ]);

    res.json({
      total: totalResult[0]?.count ?? 0,
      featured: featuredResult[0]?.count ?? 0,
      byCategory: byCategoryResult,
      byBrand: byBrandResult,
      recentlyAdded: recentProducts.map(formatProduct),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting product stats");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/products/:slug", async (req, res) => {
  try {
    const parsed = GetProductParams.safeParse(req.params);
    if (!parsed.success) return void res.status(400).json({ error: "Paramètre invalide" });

    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, parsed.data.slug))
      .limit(1);

    if (product.length === 0) return void res.status(404).json({ error: "Produit non trouvé" });
    res.json(formatProduct(product[0]));
  } catch (err) {
    req.log.error({ err }, "Error getting product");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const parsed = CreateProductBody.safeParse(req.body);
    if (!parsed.success) return void res.status(400).json({ error: "Données invalides", details: parsed.error });

    const [product] = await db.insert(productsTable).values(parsed.data).returning();
    res.status(201).json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/products/:slug", async (req, res) => {
  try {
    const paramsParsed = UpdateProductParams.safeParse(req.params);
    if (!paramsParsed.success) return void res.status(400).json({ error: "Paramètre invalide" });

    const bodyParsed = UpdateProductBody.safeParse(req.body);
    if (!bodyParsed.success) return void res.status(400).json({ error: "Données invalides" });

    const [product] = await db
      .update(productsTable)
      .set(bodyParsed.data)
      .where(eq(productsTable.slug, paramsParsed.data.slug))
      .returning();

    if (!product) return void res.status(404).json({ error: "Produit non trouvé" });
    res.json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/products/:slug", async (req, res) => {
  try {
    const parsed = DeleteProductParams.safeParse(req.params);
    if (!parsed.success) return void res.status(400).json({ error: "Paramètre invalide" });

    await db.delete(productsTable).where(eq(productsTable.slug, parsed.data.slug));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    const counts = await db
      .select({ category: productsTable.category, count: sql<number>`count(*)::int` })
      .from(productsTable)
      .groupBy(productsTable.category);

    const countMap = new Map(counts.map((c) => [c.category, c.count]));

    res.json(
      cats.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon ?? "",
        count: countMap.get(c.slug) ?? 0,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error listing categories");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    images: p.images ?? [],
    description: p.description,
    specs: (p.specs as Record<string, string>) ?? {},
    featured: p.featured,
    variants: p.variants ?? [],
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

export default router;
