import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/contact";

export function ProductCard({ product }: { product: Product }) {
  const whatsappUrl = waLink(product.name);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden bg-[#111] border border-[#333] hover:border-[#C9A027]/50 corner-accent h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0A0A0A]">
        <img
          src={product.images[0] || "https://placehold.co/600x600/1a1a1a/C9A027?text=Adil"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {product.featured && (
          <div className="absolute top-3 left-3 bg-primary text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1">
            En Vedette
          </div>
        )}
        
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#8B6914] flex items-center justify-center text-black font-bold text-xs">
          {product.brand.charAt(0).toUpperCase()}
        </div>

        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link href={`/produit/${product.slug}`} className="text-white font-serif tracking-widest uppercase text-sm border-b border-primary pb-1 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
            VOIR DÉTAILS &rarr;
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col p-5 flex-1 z-10 relative bg-[#111]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium mb-2">
          {product.brand}
        </span>
        
        <Link href={`/produit/${product.slug}`} className="block mb-4">
          <h3 className="font-serif text-lg font-bold leading-tight text-white line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.variants.slice(0, 3).map((v, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-[#333] text-[#888] font-bold uppercase tracking-wider">
                  {v}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-[10px] text-[#555] font-bold self-center">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Specs Mini */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="flex flex-col gap-1 mb-4">
              {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                <span key={k} className="text-[10px] text-[#555] truncate font-mono">
                  <span className="text-[#888]">{k}:</span> {v as string}
                </span>
              ))}
            </div>
          )}

          <div className="h-[1px] w-full bg-[#333] mb-4" />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 bg-[#1a1a1a] border border-[#25D366]/30 text-[#25D366] px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#25D366] hover:text-white hover:shadow-[0_0_15px_-3px_rgba(37,211,102,0.5)]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
