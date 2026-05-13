import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useListFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronDown, ShieldCheck, Truck, HeadphonesIcon, BadgePercent, Star, Users, Watch, Box, MapPin, MessageCircle, Zap } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { CONTACT, waLink } from "@/lib/contact";

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0A0A0A] tech-grid-bg pt-[72px]">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C9A027] rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ 
              y: [0, 40, 0],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#C9A027] rounded-full blur-[180px]"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center"
          >
            <div className="border border-primary/30 text-primary uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 rounded-full mb-8 font-bold bg-[#111]/50 backdrop-blur-sm">
              OUJDA, MAROC — ACCESSOIRES PREMIUM
            </div>
            
            <h1 className="flex flex-col items-center justify-center font-serif leading-[0.85] mb-6">
              <span className="text-[4.5rem] md:text-[8rem] font-black text-white tracking-tight">ADIL</span>
              <span className="text-[4.5rem] md:text-[8rem] font-black gold-shimmer tracking-tight">SMART STORE</span>
            </h1>
            
            <p className="text-[#888] tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-12 font-bold">
              Smartwatches • Écouteurs • Chargeurs • Powerbanks • Coques
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link href="/boutique" className="w-full sm:w-auto bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105 hover:bg-[#E8C547]">
                DÉCOUVRIR LA BOUTIQUE
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-[#555] bg-transparent text-[#888] px-10 py-4 font-bold uppercase tracking-widest text-xs transition-colors hover:border-primary hover:text-primary"
              >
                WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>

        {/* Section bas hero */}
        <div className="absolute bottom-0 left-0 w-full bg-[#070707] border-t border-[#222]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-4 text-[10px] font-mono text-[#888] uppercase tracking-widest text-center divide-y md:divide-y-0 md:divide-x divide-[#333]">
              <div className="pt-2 md:pt-0 w-full md:w-auto md:px-8">
                {CONTACT.address}
              </div>
              <div className="pt-2 md:pt-0 w-full md:w-auto md:px-8">
                {CONTACT.hours}
              </div>
              <div className="pt-2 md:pt-0 w-full md:w-auto md:px-8 text-primary font-bold">
                {CONTACT.tel1}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0D0D0D] border-b border-[#222] relative z-20 w-full">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#222]">
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center group hover:bg-[#111] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={100} />+
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Produits</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center group hover:bg-[#111] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={6} />
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Catégories</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center group hover:bg-[#111] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={500} />+
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Clients</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center group hover:bg-[#111] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                7j/7
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-[#0A0A0A] relative border-b border-[#222]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tight">NOS CATÉGORIES</h2>
            <div className="h-[2px] w-24 bg-primary mx-auto" />
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] bg-[#111] border border-[#333]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link 
                    href={`/boutique?category=${category.slug}`}
                    className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden bg-[#111] border border-[#222] p-6 text-center transition-all duration-500 hover:gold-border-glow hover:-translate-y-2 corner-accent"
                  >
                    <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110 text-[#555] group-hover:text-primary">
                      {category.name.toLowerCase().includes('watch') ? <Watch className="w-16 h-16" strokeWidth={1} /> :
                       category.name.toLowerCase().includes('écouteur') ? <HeadphonesIcon className="w-16 h-16" strokeWidth={1} /> :
                       category.name.toLowerCase().includes('chargeur') ? <Zap className="w-16 h-16" strokeWidth={1} /> :
                       <Box className="w-16 h-16" strokeWidth={1} />}
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">{category.name}</h3>
                    <div className="mt-4 bg-primary/10 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                      {category.count} Produits
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-b border-[#222]">
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-end justify-between mb-16">
            <div className="relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute -left-[100vw] top-1/2 h-[1px] bg-primary/30 w-[100vw]" 
              />
              <h2 className="font-serif text-4xl md:text-6xl font-black text-white uppercase tracking-tight relative z-10 bg-[#0A0A0A] pr-8 inline-block">
                EN VEDETTE
              </h2>
            </div>
            <Link href="/boutique" className="hidden sm:block text-[10px] font-bold text-primary border border-primary/30 px-4 py-2 uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-colors">
              VOIR TOUT
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] bg-[#111] border border-[#333]" />
              ))}
            </div>
          ) : (
            <div className="relative group/carousel">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-6">
                  {featuredProducts?.map((product) => (
                    <CarouselItem key={product.id} className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                  <CarouselPrevious className="left-[-24px] bg-[#111] border-[#C9A027] text-[#C9A027] hover:bg-[#C9A027] hover:text-black rounded-none w-12 h-12" />
                  <CarouselNext className="right-[-24px] bg-[#111] border-[#C9A027] text-[#C9A027] hover:bg-[#C9A027] hover:text-black rounded-none w-12 h-12" />
                </div>
              </Carousel>
            </div>
          )}
          
          <div className="mt-12 text-center sm:hidden">
             <Link href="/boutique" className="inline-block text-[10px] font-bold text-primary border border-primary/30 px-6 py-3 uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-colors w-full">
              VOIR TOUT
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Pourquoi Adil Smart Store
            </h2>
            <div className="h-[2px] w-24 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#0D0D0D] border border-[#222] p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/40 transition-colors">
              <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1} />
              <h3 className="font-serif text-2xl font-bold text-white uppercase">100% Authentique</h3>
              <p className="text-[#888] text-sm">Tous nos produits sont garantis originaux avec la qualité des grandes marques.</p>
            </div>
            <div className="bg-[#0D0D0D] border border-[#222] p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/40 transition-colors">
              <BadgePercent className="w-12 h-12 text-primary" strokeWidth={1} />
              <h3 className="font-serif text-2xl font-bold text-white uppercase">Meilleurs Prix</h3>
              <p className="text-[#888] text-sm">Des tarifs compétitifs garantis sur toute la ville d'Oujda et ses environs.</p>
            </div>
            <div className="bg-[#0D0D0D] border border-[#222] p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/40 transition-colors">
              <HeadphonesIcon className="w-12 h-12 text-primary" strokeWidth={1} />
              <h3 className="font-serif text-2xl font-bold text-white uppercase">Support 7j/7</h3>
              <p className="text-[#888] text-sm">Une équipe réactive disponible tous les jours sur WhatsApp pour vous conseiller.</p>
            </div>
            <div className="bg-[#0D0D0D] border border-[#222] p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/40 transition-colors">
              <Truck className="w-12 h-12 text-primary" strokeWidth={1} />
              <h3 className="font-serif text-2xl font-bold text-white uppercase">Livraison Oujda</h3>
              <p className="text-[#888] text-sm">Service de livraison rapide disponible partout dans la ville d'Oujda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-[#C9A027] to-[#8B6914] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 tech-grid-bg mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-4">
            Vous cherchez un produit ?
          </h2>
          <p className="text-black/80 font-bold mb-10 max-w-xl mx-auto uppercase tracking-widest text-sm">
            Contactez-nous directement sur WhatsApp pour vérifier la disponibilité, obtenir le meilleur prix ou passer commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-12">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-[#C9A027] px-8 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              CONTACTER SUR WHATSAPP
            </a>
            <Link
              href="/boutique"
              className="border-2 border-black bg-transparent text-black px-8 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-colors hover:bg-black hover:text-[#C9A027]"
            >
              VOIR LA BOUTIQUE
            </Link>
          </div>
          <div className="flex items-center gap-2 text-black/90 font-bold text-xs uppercase tracking-widest">
            <MapPin className="w-4 h-4" />
            {CONTACT.address}
          </div>
        </div>
      </section>
    </Layout>
  );
}
