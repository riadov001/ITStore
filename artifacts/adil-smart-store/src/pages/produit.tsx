import { Layout } from "@/components/layout/Layout";
import { useGetProduct, getGetProductQueryKey, useListProducts } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, MessageCircle, ChevronRight, ShieldCheck, Truck, HeadphonesIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { CONTACT, waLink } from "@/lib/contact";

export default function Produit() {
  const [, params] = useRoute("/produit/:slug");
  const slug = params?.slug || "";
  const { toast } = useToast();

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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié !",
      description: "Le lien du produit a été copié dans le presse-papier.",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Skeleton className="aspect-square bg-[#111] border border-[#222] rounded-none" />
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
          <p className="text-[#888] uppercase tracking-widest text-sm mb-8">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link href="/boutique" className="bg-primary text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#E8C547] transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = relatedData?.products.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <Layout>
      <div className="bg-[#0A0A0A] min-h-screen">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="border-b border-[#222] bg-[#070707] py-3 mt-[68px] md:mt-[100px]"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#555]">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/boutique" className="hover:text-primary transition-colors">Boutique</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white truncate">{product.name}</span>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Images Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-[#111] border border-[#222] p-8 cursor-crosshair hover:neon-glow transition-all duration-300">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={product.images[activeImage] || "https://placehold.co/800x800/111111/C9A027?text=Adil"}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-125 transition-transform duration-500 origin-center"
                  />
                </AnimatePresence>
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1.5">
                    En Vedette
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square bg-[#111] transition-all border ${
                        activeImage === idx 
                          ? "border-primary" 
                          : "border-[#222] hover:border-[#555] opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Miniature ${idx}`} className="w-full h-full object-cover p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#111] border border-[#333] text-[#ccc] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                      {product.brand}
                    </div>
                    <span className="text-primary text-[10px] uppercase tracking-[0.2em] font-bold">{product.category}</span>
                  </div>
                  <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-[1.1] uppercase">
                    {product.name}
                  </h1>
                </div>
                
                {/* Share Actions */}
                <div className="flex gap-2 shrink-0">
                  <button onClick={copyLink} className="w-10 h-10 border border-[#222] bg-[#111] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors" title="Copier le lien">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#222] mb-8" />

              <div className="prose prose-invert max-w-none mb-10">
                <p className="text-[#888] font-sans leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-[10px] font-bold text-white mb-4 uppercase tracking-[0.2em]">Variantes / Couleurs</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, idx) => (
                      <div key={idx} className="px-4 py-2 border border-[#333] bg-[#111]">
                        <span className="text-xs font-bold text-[#ccc] uppercase tracking-wider">{variant}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-10">
                  <h3 className="text-[10px] font-bold text-white mb-4 uppercase tracking-[0.2em]">Spécifications techniques</h3>
                  <div className="border border-[#222] bg-[#111] overflow-hidden">
                    <motion.table 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } }
                      }}
                      className="w-full text-sm"
                    >
                      <tbody className="divide-y divide-[#222]">
                        {Object.entries(product.specs).map(([key, value], idx) => (
                          <motion.tr 
                            key={key} 
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                            }}
                            className={idx % 2 === 0 ? "bg-[#161616]" : "bg-[#111]"}
                          >
                            <td className="py-3 px-4 text-[#888] w-1/3 uppercase tracking-widest text-[10px] font-bold">{key}</td>
                            <td className="py-3 px-4 text-white font-mono text-xs">{value as string}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </motion.table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto space-y-4 pt-4 border-t border-[#222]">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={waLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] px-8 py-4 text-sm font-bold text-white uppercase tracking-widest transition-all hover:bg-[#20bd5a] hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle className="w-5 h-5" /> Demander le Prix
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://wa.me/${CONTACT.wa2}?text=${encodeURIComponent(`Bonjour, plus d'infos sur : ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#25D366] hover:text-white"
                >
                  <MessageCircle className="w-4 h-4" /> Contacter le 2ème numéro
                </motion.a>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#222]">
                <div className="flex flex-col items-center text-center gap-2 text-[#888]">
                  <Truck className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Livraison Oujda</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-[#888]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">100% Authentique</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-[#888]">
                  <HeadphonesIcon className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Support 7j/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-[#222]">
              <div className="mb-12 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                  PRODUITS SIMILAIRES
                </h2>
                <div className="h-[2px] w-24 bg-primary mx-auto" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
                {relatedProducts.map(p => (
                  <div key={p.id} className="h-full">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
