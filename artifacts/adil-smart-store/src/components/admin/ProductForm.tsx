import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, ProductInput, ProductUpdate } from "@workspace/api-client-react/src/generated/api.schemas";
import { useCreateProduct, useUpdateProduct, getListProductsQueryKey, getGetProductStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListCategories } from "@workspace/api-client-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  brand: z.string().min(1, "La marque est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  images: z.string().min(1, "Au moins une image est requise"),
  description: z.string().min(10, "La description est requise"),
  specs: z.string().optional(),
  featured: z.boolean().default(false),
  variants: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm({ product, onSuccess }: { product?: Product, onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: categories } = useListCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      brand: product?.brand || "",
      category: product?.category || "",
      images: product?.images?.join("\n") || "",
      description: product?.description || "",
      specs: product?.specs ? JSON.stringify(product.specs, null, 2) : "{\n  \"Couleur\": \"Noir\"\n}",
      featured: product?.featured || false,
      variants: product?.variants?.join(", ") || "",
    },
  });

  const watchName = form.watch("name");

  useEffect(() => {
    if (!product && watchName) {
      const slug = watchName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
    }
  }, [watchName, product, form]);

  const onSubmit = async (values: FormValues) => {
    let parsedSpecs = undefined;
    if (values.specs) {
      try {
        parsedSpecs = JSON.parse(values.specs);
      } catch (e) {
        toast({
          title: "Erreur",
          description: "Le format des spécifications (JSON) est invalide.",
          variant: "destructive",
        });
        return;
      }
    }

    const payload: ProductInput | ProductUpdate = {
      name: values.name,
      slug: values.slug,
      brand: values.brand,
      category: values.category,
      images: values.images.split("\n").map(s => s.trim()).filter(Boolean),
      description: values.description,
      specs: parsedSpecs,
      featured: values.featured,
      variants: values.variants ? values.variants.split(",").map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({ slug: product.slug, data: payload as ProductUpdate });
        toast({ title: "Succès", description: "Produit mis à jour avec succès." });
      } else {
        await createProduct.mutateAsync({ data: payload as ProductInput });
        toast({ title: "Succès", description: "Produit créé avec succès." });
      }
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="iPhone 15 Pro Max Case" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="iphone-15-pro-max-case" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl>
                  <Input placeholder="Apple" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map(c => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                  ))}
                  {!categories?.find(c => c.slug === field.value) && field.value && (
                    <SelectItem value={field.value}>{field.value}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (Une URL par ligne)</FormLabel>
              <FormControl>
                <Textarea placeholder="https://..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description du produit..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécifications (JSON)</FormLabel>
              <FormControl>
                <Textarea className="font-mono text-sm" placeholder='{"Matière": "Cuir"}' rows={4} {...field} />
              </FormControl>
              <FormDescription>Doit être un JSON valide de clé-valeur.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variantes (Séparées par des virgules)</FormLabel>
              <FormControl>
                <Input placeholder="Noir, Blanc, Or" {...field} />
              </FormControl>
              <FormDescription>Ex: couleurs, tailles.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">En Vedette</FormLabel>
                <FormDescription>Afficher ce produit sur la page d'accueil.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
          {createProduct.isPending || updateProduct.isPending ? "Enregistrement..." : "Enregistrer le produit"}
        </Button>
      </form>
    </Form>
  );
}
