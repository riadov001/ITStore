import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetProductStats, useListProducts, useDeleteProduct, getListProductsQueryKey, getGetProductStatsQueryKey } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, Form, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-primary">Adil Smart Store</h1>
            <p className="text-muted-foreground">Administration</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/20 text-center"
            />
            <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90">
              Connexion
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold">Tableau de Bord</h1>
          <Button onClick={openCreate} className="bg-primary text-black hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un Produit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h3 className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider">Total Produits</h3>
            <p className="text-4xl font-bold text-white">{stats?.total || 0}</p>
          </div>
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h3 className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider">En Vedette</h3>
            <p className="text-4xl font-bold text-primary">{stats?.featured || 0}</p>
          </div>
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">Répartition</h3>
            <div className="h-24 w-full">
              {stats?.byCategory && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byCategory}>
                    <XAxis dataKey="category" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Produit</TableHead>
                <TableHead className="text-muted-foreground">Marque</TableHead>
                <TableHead className="text-muted-foreground">Catégorie</TableHead>
                <TableHead className="text-muted-foreground text-center">Vedette</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData?.products.map((product) => (
                <TableRow key={product.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-black" />
                    {product.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-muted-foreground">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.featured ? <span className="text-primary">★</span> : <span className="text-muted-foreground/30">★</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background border-white/10 text-foreground">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer {product.name} ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/20">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.slug)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="bg-background border-white/10 text-foreground max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-primary">
                {editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm product={editingProduct} onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
