import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetProductStats, useListProducts, useDeleteProduct, getListProductsQueryKey, getGetProductStatsQueryKey } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, LogIn, Star } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetProductStats({ query: { enabled: isAuthenticated } });
  const { data: productsData } = useListProducts({ limit: 100 }, { query: { enabled: isAuthenticated } });
  const deleteProduct = useDeleteProduct();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "adil2024") {
      setIsAuthenticated(true);
    } else {
      toast({ title: "Erreur", description: "Mot de passe incorrect", variant: "destructive" });
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteProduct.mutateAsync({ slug });
      toast({ title: "Succès", description: "Produit supprimé avec succès." });
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression du produit.", variant: "destructive" });
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] tech-grid-bg flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md p-10 bg-[#111] border border-[#333] corner-accent relative">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-black text-white uppercase tracking-tight mb-2">ADIL</h1>
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Portail d'Administration</p>
          </div>
          <div className="space-y-6">
            <Input
              type="password"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0A0A0A] border-[#333] text-center text-white h-12 uppercase tracking-widest text-xs focus-visible:ring-primary rounded-none"
            />
            <button type="submit" className="w-full bg-primary text-black font-bold uppercase tracking-widest text-xs h-12 hover:bg-[#E8C547] transition-colors flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> ACCÉDER
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#333] pb-8">
          <div>
            <h1 className="font-serif text-5xl font-black text-white uppercase tracking-tight">Tableau de Bord</h1>
            <p className="text-[#888] text-[10px] uppercase tracking-[0.2em] font-bold mt-2">Gestion du catalogue</p>
          </div>
          <button onClick={openCreate} className="bg-primary text-black font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#E8C547] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> NOUVEAU PRODUIT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 border border-[#333] bg-[#111] corner-accent relative">
            <h3 className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">TOTAL PRODUITS</h3>
            <p className="font-serif text-6xl font-black text-white">{stats?.total || 0}</p>
          </div>
          <div className="p-8 border border-[#333] bg-[#111] corner-accent relative">
            <h3 className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">EN VEDETTE</h3>
            <p className="font-serif text-6xl font-black text-primary">{stats?.featured || 0}</p>
          </div>
          <div className="p-8 border border-[#333] bg-[#111] corner-accent relative">
            <h3 className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">RÉPARTITION</h3>
            <div className="h-16 w-full">
              {stats?.byCategory && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byCategory}>
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', borderRadius: 0, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }} />
                    <Bar dataKey="count" fill="#C9A027" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#333] bg-[#111]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333] hover:bg-transparent">
                <TableHead className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] py-6">Produit</TableHead>
                <TableHead className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] py-6">Marque</TableHead>
                <TableHead className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] py-6">Catégorie</TableHead>
                <TableHead className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] py-6 text-center">Vedette</TableHead>
                <TableHead className="text-[#888] text-[10px] font-bold uppercase tracking-[0.2em] py-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData?.products.map((product) => (
                <TableRow key={product.id} className="border-[#333] hover:bg-[#1a1a1a] transition-colors">
                  <TableCell className="font-medium text-white flex items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-[#0A0A0A] border border-[#333] p-1">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{product.name}</span>
                  </TableCell>
                  <TableCell className="text-[#ccc] text-xs uppercase tracking-widest">{product.brand}</TableCell>
                  <TableCell>
                    <span className="border border-[#555] text-[#888] px-2 py-1 text-[10px] uppercase tracking-widest font-bold">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.featured ? <Star className="w-4 h-4 text-primary mx-auto fill-primary" /> : <Star className="w-4 h-4 text-[#333] mx-auto" />}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(product)} className="text-[#888] hover:text-primary transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-[#888] hover:text-[#ff4444] transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#111] border-[#333] rounded-none">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-serif text-2xl uppercase text-white">Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#888] text-sm uppercase tracking-widest">
                              Êtes-vous sûr de vouloir supprimer <strong className="text-white">{product.name}</strong> ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel className="border-[#333] bg-transparent text-white rounded-none hover:bg-[#222] text-xs font-bold uppercase tracking-widest">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.slug)} className="bg-[#ff4444] text-white rounded-none hover:bg-[#cc0000] text-xs font-bold uppercase tracking-widest">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {productsData?.products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-[#888] text-xs font-bold uppercase tracking-widest">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="bg-[#111] border-[#333] text-white rounded-none max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-serif text-3xl font-black text-white uppercase tracking-tight">
                {editingProduct ? "MODIFIER LE PRODUIT" : "NOUVEAU PRODUIT"}
              </DialogTitle>
              <div className="h-[2px] w-12 bg-primary mt-4" />
            </DialogHeader>
            <ProductForm product={editingProduct} onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
