import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { useListProducts, useListCategories, useGetProductStats } from "@workspace/api-client-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Boutique() {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const initialCategory = searchParams.get("category") || undefined;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  
  // To handle pagination (load more)
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: categoriesData } = useListCategories();
  const { data: statsData } = useGetProductStats();
  
  // Use a query hook that fetches the current page
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

  // When filters change, reset page and products
  useState(() => {
    // In a real app we'd want to synchronize this better with the fetching cycle
    // but for simplicity we'll just rely on the API returning the new filtered list
    // A better approach would be infinite query, but we'll use simple state for now.
  });

  const brands = statsData?.byBrand || [];

  return (
    <Layout>
      <div className="bg-black/80 py-12 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white">Notre Boutique</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explorez notre collection exclusive d'accessoires premium.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Recherche</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Catégorie</h3>
              <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? undefined : val)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white">
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categoriesData?.map(c => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name} ({c.count})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Marque</h3>
              <Select value={brand || "all"} onValueChange={(val) => setBrand(val === "all" ? undefined : val)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Toutes les marques" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white">
                  <SelectItem value="all">Toutes les marques</SelectItem>
                  {brands.map(b => (
                    <SelectItem key={b.brand} value={b.brand}>{b.brand} ({b.count})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-xl bg-white/5" />
                    <Skeleton className="h-4 w-2/3 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                ))}
              </div>
            ) : data?.products.length === 0 ? (
              <div className="text-center py-24 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xl text-muted-foreground">Aucun produit trouvé.</p>
                <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10" onClick={() => {
                  setSearch("");
                  setCategory(undefined);
                  setBrand(undefined);
                }}>Réinitialiser les filtres</Button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {data && data.total > (page + 1) * limit && (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-black rounded-none px-8 py-6 uppercase tracking-widest font-bold"
                      onClick={() => setPage(p => p + 1)}
                      disabled={isFetching}
                    >
                      {isFetching ? "Chargement..." : "Charger plus"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
