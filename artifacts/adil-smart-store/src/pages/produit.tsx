import { Layout } from "@/components/layout/Layout";
import { useGetProduct, getGetProductQueryKey, useListProducts } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Instagram, MessageCircle } from "lucide-react";
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
    { category: product?.category, limit: 5 },
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
        <div className="container mx-auto px-4 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Skeleton className="aspect-square bg-[#111] border border-[#333] rounded-none" />
            <div className="space-y-8">
              <Skeleton className="h-8 w-32 bg-[#111]" />
              <Skeleton className="h-16 w-full bg-[#111]" />
              <Skeleton className="h-40 w-full bg-[#111]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="font-serif text-5xl font-black text-white mb-6 uppercase">Produit non trouvé</h1>
          <p className="text-[#888] uppercase tracking-widest text-sm">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        </div>
      </Layout>
    );
  }

  const whatsappText = encodeURIComponent(`Bonjour Adil Smart Store, je voudrais connaître le prix de : ${product.name}`);
  const whatsappUrl = `https://wa.me/212600000000?text=${whatsappText}`;

  const relatedProducts = relatedData?.products.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden bg-[#0A0A0A] border border-[#333] corner-accent group p-8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={product.images[activeImage] || "https://placehold.co/800x800/1a1a1a/C9A027?text=Adil"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square overflow-hidden bg-[#111] transition-all ${
                      activeImage === idx 
                        ? "border border-primary scale-100" 
                        : "border border-[#333] hover:border-[#555] opacity-60 hover:opacity-100 scale-95"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4">
            <div className="mb-6 flex items-center gap-4">
              <div className="border border-primary text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em]">
                {product.brand}
              </div>
              <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] font-bold">{product.category}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-[0.9] mb-8 uppercase">
              {product.name}
            </h1>

            <div className="h-[1px] w-full bg-[#333] mb-8" />

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-[#888] font-sans leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-12">
                <h3 className="text-[10px] font-bold text-white mb-4 uppercase tracking-[0.2em]">Variantes Disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-[#333] bg-[#111]">
                      <span className="w-3 h-3 rounded-full bg-[#222] border border-[#555]" />
                      <span className="text-xs font-bold text-[#ccc] uppercase tracking-wider">{variant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs Grid */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-12">
                <h3 className="text-[10px] font-bold text-white mb-4 uppercase tracking-[0.2em]">Spécifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="p-4 border border-[#333] bg-[#111]">
                      <p className="text-[10px] text-[#888] uppercase tracking-widest font-bold mb-1">{key}</p>
                      <p className="text-sm font-medium text-white">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-[#333] flex flex-col gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] px-8 py-5 text-sm font-bold text-white uppercase tracking-widest transition-all hover:bg-[#20bd5a] hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.5)]"
              >
                <MessageCircle className="w-5 h-5" /> Demander le Prix sur WhatsApp
              </a>
              
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+212600000000"
                  className="flex items-center justify-center gap-2 border border-[#333] bg-[#111] px-4 py-4 text-[10px] font-bold text-[#ccc] uppercase tracking-widest transition-all hover:border-primary hover:text-primary"
                >
                  <Phone className="w-4 h-4" /> Appeler
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#333] bg-[#111] px-4 py-4 text-[10px] font-bold text-[#ccc] uppercase tracking-widest transition-all hover:border-[#E1306C] hover:text-[#E1306C]"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-[#333]">
            <div className="mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                PRODUITS SIMILAIRES
              </h2>
              <div className="h-[2px] w-24 bg-primary" />
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
