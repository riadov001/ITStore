import { Layout } from "@/components/layout/Layout";
import { useGetProduct, getGetProductQueryKey, useListProducts } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Phone, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Produit() {
  const [, params] = useRoute("/produit/:slug");
  const slug = params?.slug || "";

  const { data: product, isLoading } = useGetProduct(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetProductQueryKey(slug),
    }
  });

  const { data: relatedData } = useListProducts(
    { category: product?.category, limit: 4 },
    { query: { enabled: !!product?.category } }
  );

  const [activeImage, setActiveImage] = useState(0);

  // Reset active image when product changes
  useState(() => {
    setActiveImage(0);
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl bg-white/5" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3 bg-white/5" />
              <Skeleton className="h-6 w-1/3 bg-white/5" />
              <Skeleton className="h-32 w-full bg-white/5" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-white mb-4">Produit non trouvé</h1>
          <p className="text-muted-foreground">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        </div>
      </Layout>
    );
  }

  const whatsappText = encodeURIComponent(`Bonjour Adil Smart Store, je voudrais connaître le prix de : ${product.name}`);
  const whatsappUrl = `https://wa.me/212600000000?text=${whatsappText}`;

  const relatedProducts = relatedData?.products.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-black border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage] || "https://placehold.co/800x800/1a1a1a/D4AF37?text=Adil"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-primary" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-white/5 uppercase tracking-widest px-3 py-1">
                {product.brand}
              </Badge>
              <span className="text-muted-foreground text-sm uppercase tracking-wider">{product.category}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              {product.name}
            </h1>

            <div className="prose prose-invert max-w-none text-muted-foreground mb-10 font-light">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Variantes Disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, idx) => (
                    <div key={idx} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/80">
                      {variant}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs Grid */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Spécifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                      <p className="text-xs text-muted-foreground mb-1">{key}</p>
                      <p className="text-sm font-medium text-white">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-8 py-5 text-lg font-bold text-white transition-all hover:bg-[#25D366]/90 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(37,211,102,0.4)]"
              >
                Demander le Prix sur WhatsApp
              </a>
              
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+212600000000"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-4 text-sm font-bold text-white transition-all hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" /> Appeler le Magasin
                </a>
                <a
                  href="https://instagram.com/adilsmartstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-4 text-sm font-bold text-white transition-all hover:bg-white/5 hover:border-[#E1306C] hover:text-[#E1306C]"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-white/10 pt-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold mb-4 text-white">Produits Similaires</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
