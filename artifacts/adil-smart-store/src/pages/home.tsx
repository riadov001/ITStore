import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useListFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronDown, ShieldCheck, Truck, HeadphonesIcon, BadgePercent, Star, Users, Watch, Box } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start = null;
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

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center"
          >
            <div className="border border-[#C9A027]/30 text-primary uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 rounded-full mb-8 font-bold bg-[#111]/50 backdrop-blur-sm">
              OUJDA, MAROC — ACCESSOIRES PREMIUM
            </div>
            
            <h1 className="flex flex-col items-center justify-center font-serif leading-[0.85] mb-6">
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] font-black text-white tracking-tight">ADIL</span>
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] font-black gold-shimmer tracking-tight">SMART STORE</span>
            </h1>
            
            <p className="text-[#888] tracking-[0.3em] text-xs sm:text-sm uppercase mb-12">
              Smartwatches • Écouteurs • Chargeurs • Powerbanks • Coques
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link href="/boutique" className="w-full sm:w-auto bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105 hover:bg-[#E8C547]">
                DÉCOUVRIR LA BOUTIQUE
              </Link>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-[#555] bg-transparent text-[#888] px-10 py-4 font-bold uppercase tracking-widest text-xs transition-colors hover:border-[#C9A027] hover:text-[#C9A027]"
              >
                WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[30rem] font-serif font-black text-[#C9A027] opacity-5 pointer-events-none select-none leading-none mr-[-10%]">
          01
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#555]"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#111] border-y border-[#333] relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#333]">
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center group hover:bg-[#1a1a1a] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={100} />+
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Marques</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center group hover:bg-[#1a1a1a] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={6} />
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Catégories</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center group hover:bg-[#1a1a1a] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                <Counter from={0} to={500} />+
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Clients Satisfaits</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center group hover:bg-[#1a1a1a] transition-colors">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                7j/7
              </span>
              <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-[#0A0A0A] scan-lines relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16">
            <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">NOS CATÉGORIES</h2>
            <div className="h-[2px] w-24 bg-primary" />
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] bg-[#111] border border-[#333]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                    className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden bg-[#111] border border-[#333] p-6 text-center transition-all duration-500 hover:gold-border-glow hover:-translate-y-2 corner-accent"
                  >
                    <div className="mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:text-primary text-[#555]">
                      {/* Simple logic for icon, you might want to map these better */}
                      {category.name.toLowerCase().includes('watch') ? <Watch className="w-16 h-16" strokeWidth={1} /> :
                       category.name.toLowerCase().includes('écouteur') ? <HeadphonesIcon className="w-16 h-16" strokeWidth={1} /> :
                       <Box className="w-16 h-16" strokeWidth={1} />}
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">{category.name}</h3>
                    <span className="mt-4 text-[10px] uppercase tracking-widest text-[#888] font-bold group-hover:text-primary transition-colors">
                      {category.count} Produits
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-[#333]">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] bg-[#111] border border-[#333]" />
              ))}
            </div>
          ) : (
            <div className="relative group/carousel">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-6">
                  {featuredProducts?.map((product) => (
                    <CarouselItem key={product.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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

      {/* Why Us Band */}
      <section className="bg-[#C9A027] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-black/20">
            <div className="flex items-center justify-center gap-4 w-full py-4 md:py-0">
              <ShieldCheck className="w-6 h-6 text-black" strokeWidth={1.5} />
              <span className="font-bold text-black text-xs uppercase tracking-widest">Produits Authentiques</span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full py-4 md:py-0">
              <Truck className="w-6 h-6 text-black" strokeWidth={1.5} />
              <span className="font-bold text-black text-xs uppercase tracking-widest">Livraison Rapide à Oujda</span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full py-4 md:py-0">
              <HeadphonesIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
              <span className="font-bold text-black text-xs uppercase tracking-widest">Support WhatsApp 7j/7</span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full py-4 md:py-0">
              <BadgePercent className="w-6 h-6 text-black" strokeWidth={1.5} />
              <span className="font-bold text-black text-xs uppercase tracking-widest">Meilleurs Prix Garantis</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
