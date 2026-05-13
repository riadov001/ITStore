import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const whatsappText = encodeURIComponent(`Bonjour Adil Smart Store, je voudrais connaître le prix de : ${product.name}`);
  const whatsappUrl = `https://wa.me/212600000000?text=${whatsappText}`;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.2)]"
    >
      <Link href={`/produit/${product.slug}`} className="block aspect-square overflow-hidden bg-white/5">
        <img
          src={product.images[0] || "https://placehold.co/600x600/1a1a1a/D4AF37?text=Adil"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground hover:bg-primary/90">
            En Vedette
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</span>
          <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
        </div>
        <Link href={`/produit/${product.slug}`} className="block">
          <h3 className="font-serif text-lg font-bold line-clamp-2 hover:text-primary transition-colors mb-4">{product.name}</h3>
        </Link>
        <div className="mt-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#25D366]/90 hover:shadow-[0_0_15px_-3px_rgba(37,211,102,0.5)]"
          >
            Demander le Prix sur WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
