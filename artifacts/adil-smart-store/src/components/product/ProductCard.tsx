import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const whatsappText = encodeURIComponent(`Bonjour Adil Smart Store, je voudrais connaître le prix de : ${product.name}`);
  const whatsappUrl = `https://wa.me/212600000000?text=${whatsappText}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden bg-[#111] border border-[#333] hover:border-[#C9A027]/50 corner-accent"
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

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <Link href={`/produit/${product.slug}`} className="text-white font-serif tracking-widest uppercase text-sm border-b border-primary pb-1">
            VOIR DÉTAILS &rarr;
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col p-5 flex-1 z-10 relative bg-[#111]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium mb-2">
          {product.brand}
        </span>
        
        <Link href={`/produit/${product.slug}`} className="block flex-1">
          <h3 className="font-serif text-lg font-bold leading-tight text-white line-clamp-2 mb-3">
            {product.name}
          </h3>
        </Link>
        
        {product.variants && product.variants.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.variants.slice(0, 3).map((v, i) => (
              <span key={i} className="w-3 h-3 rounded-full border border-[#555] bg-[#222]" title={v} />
            ))}
            {product.variants.length > 3 && (
              <span className="text-xs text-[#555] ml-1">+{product.variants.length - 3}</span>
            )}
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
    </motion.div>
  );
}
