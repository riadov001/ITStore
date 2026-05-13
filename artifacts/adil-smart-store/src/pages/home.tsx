import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center overflow-hidden">
        {/* Abstract floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              L'Élégance <span className="text-primary italic">Technologique</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest font-light">
              Accessoires Premium • Oujda, Maroc
            </p>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-light">
              Smartwatches • Écouteurs • Chargeurs • Accessoires
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/boutique" className="w-full sm:w-auto inline-flex items-center justify-center rounded-none bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)]">
                Découvrir la Boutique
              </Link>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-none border border-white/20 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:border-[#25D366] hover:text-[#25D366]"
              >
                Nous Contacter sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Nos Catégories</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/boutique?category=${category.slug}`}
                    className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <h3 className="font-serif text-xl font-bold text-white relative z-10 group-hover:text-primary transition-colors">{category.name}</h3>
                    <span className="mt-2 text-sm text-muted-foreground relative z-10">{category.count} produits</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">En Vedette</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>
            <Link href="/boutique" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider hidden sm:block">
              Voir tout
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-xl bg-white/5" />
                  <Skeleton className="h-4 w-2/3 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredProducts?.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="left-[-50px] bg-black/50 border-white/20 hover:bg-primary hover:text-black" />
                <CarouselNext className="right-[-50px] bg-black/50 border-white/20 hover:bg-primary hover:text-black" />
              </div>
            </Carousel>
          )}
          
          <div className="mt-8 text-center sm:hidden">
             <Link href="/boutique" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
              Voir tout
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
