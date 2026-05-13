import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { useListProducts, useListCategories, useGetProductStats } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Boutique() {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const initialCategory = searchParams.get("category") || undefined;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: categoriesData } = useListCategories();
  const { data: statsData } = useGetProductStats();
  
  const { data, isLoading, isFetching } = useListProducts({
    search: debouncedSearch,
    category: category === "all" ? undefined : category,
    brand: brand === "all" ? undefined : brand,
    limit,
    offset: page * limit,
  }, {
    query: {
      queryKey: ["/api/products", { search: debouncedSearch, category, brand, limit, offset: page * limit }] as const,
    }
  });

  const brands = statsData?.byBrand || [];

  return (
    <Layout>
      {/* Header Band */}
      <div className="bg-[#0A0A0A] border-b border-[#222] pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid-bg opacity-30" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-[4rem] md:text-[6rem] font-black text-white uppercase tracking-tight leading-none mb-6">
            BOUTIQUE
          </h1>
          <div className="h-[2px] w-24 bg-primary mx-auto mb-6" />
          <p className="text-[#888] uppercase tracking-[0.2em] text-xs font-bold">
            {statsData?.total || 0} PRODUITS DISPONIBLES
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0D0D0D] border-b border-[#222] sticky top-[68px] z-40 shadow-xl">
        <div className="container mx-auto py-4">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 px-4 justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
              <Input 
                placeholder="RECHERCHER..." 
                className="pl-12 bg-[#111] border-[#333] text-white rounded-none h-12 uppercase tracking-widest text-xs focus-visible:ring-primary focus-visible:border-primary placeholder:text-[#555]"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>

            {/* Category Pills (Horizontal Scroll Mobile) */}
            <div className="w-full lg:flex-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              <div className="flex lg:flex-wrap items-center gap-2 lg:justify-center min-w-max px-1">
                <button
                  onClick={() => { setCategory(undefined); setPage(0); }}
                  className={`px-6 py-3 lg:py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors whitespace-nowrap ${
                    !category || category === "all"
                      ? "bg-primary border-primary text-black"
                      : "bg-[#111] border-[#333] text-[#888] hover:border-[#555] hover:text-white"
                  }`}
                >
                  Tous
                </button>
                {categoriesData?.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => { setCategory(c.slug); setPage(0); }}
                    className={`px-6 py-3 lg:py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors whitespace-nowrap ${
                      category === c.slug
                        ? "bg-primary border-primary text-black"
                        : "bg-[#111] border-[#333] text-[#888] hover:border-[#555] hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="w-full lg:w-64 shrink-0">
              <Select value={brand || "all"} onValueChange={(val) => { setBrand(val === "all" ? undefined : val); setPage(0); }}>
                <SelectTrigger className="bg-[#111] border-[#333] rounded-none h-12 text-xs uppercase tracking-widest font-bold text-white">
                  <SelectValue placeholder="MARQUE" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] rounded-none">
                  <SelectItem value="all" className="text-xs uppercase tracking-widest font-bold focus:bg-[#222]">TOUTES LES MARQUES</SelectItem>
                  {brands.map(b => (
                    <SelectItem key={b.brand} value={b.brand} className="text-xs uppercase tracking-widest font-bold focus:bg-[#222]">{b.brand} ({b.count})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="px-4 mt-4 text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">
              {data?.total || 0} produit(s) trouvé(s)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] py-16">
        <div className="container mx-auto px-4">
          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="aspect-[3/4] bg-[#111] border border-[#222] rounded-none" />
              ))}
            </div>
          ) : data?.products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 bg-[#111] border border-[#222] text-center"
            >
              <AlertCircle className="w-16 h-16 text-[#555] mb-6" strokeWidth={1} />
              <h3 className="font-serif text-3xl font-bold text-white mb-4">AUCUN PRODUIT TROUVÉ</h3>
              <p className="text-[#888] mb-8 uppercase tracking-widest text-xs">Veuillez modifier vos critères de recherche.</p>
              <button 
                onClick={() => {
                  setSearch("");
                  setCategory(undefined);
                  setBrand(undefined);
                  setPage(0);
                }}
                className="bg-transparent border border-primary text-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-colors"
              >
                RÉINITIALISER LES FILTRES
              </button>
            </motion.div>
          ) : (
            <div className="space-y-16">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 items-stretch">
                {data?.products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="h-full"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              {data && data.total > (page + 1) * limit && (
                <div className="text-center">
                  <button 
                    className="bg-transparent border border-primary text-primary px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                    onClick={() => setPage(p => p + 1)}
                    disabled={isFetching}
                  >
                    {isFetching ? "CHARGEMENT..." : "CHARGER PLUS"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Layout>
  );
}
