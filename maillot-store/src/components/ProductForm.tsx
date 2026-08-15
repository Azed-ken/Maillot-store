"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { createProduct, updateProduct, uploadProductPhoto, type ProductInput } from "@/lib/actions/products";
import type { Category, Product, ProductKind } from "@/lib/types";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || "");
  const [kind, setKind] = useState<ProductKind>(product?.kind || "domicile");
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [photos, setPhotos] = useState<string[]>(product?.photos || []);
  const [isNew, setIsNew] = useState(product?.is_new || false);
  const [isPopular, setIsPopular] = useState(product?.is_popular || false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSize = (s: string) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductPhoto(formData);
    if (result.ok && result.url) {
      setPhotos((prev) => [...prev, result.url as string]);
    } else {
      setError(result.error || "Échec de l'upload.");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price) {
      setError("Le nom et le prix sont obligatoires.");
      return;
    }

    setSaving(true);
    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      category_id: categoryId || null,
      kind,
      sizes,
      photos,
      is_new: isNew,
      is_popular: isPopular,
      is_active: isActive,
    };

    const result = product
      ? await updateProduct(product.id, input)
      : await createProduct(input);

    setSaving(false);

    if (!result.ok) {
      setError(result.error || "Une erreur est survenue.");
      return;
    }

    router.push("/admin/produits");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">Nom du produit *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Prix (FCFA) *</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Stock</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Catégorie (club / sélection)</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.country_flag ? `${c.country_flag} ` : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Type de maillot</label>
          <select value={kind} onChange={(e) => setKind(e.target.value as ProductKind)} className="input-field">
            <option value="domicile">Domicile</option>
            <option value="exterieur">Extérieur</option>
            <option value="third">Third</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-ink-700">
          Tailles disponibles (facultatif)
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                sizes.includes(s)
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-ink-950/15 text-ink-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-ink-700">Photos</label>
        <div className="flex flex-wrap gap-3">
          {photos.map((photo, i) => (
            <div key={photo + i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink-950/10">
              <Image src={photo} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-950/20 text-ink-700/60 hover:border-ink-950/40">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span className="text-[10px]">Ajouter</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          Nouveau
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
          Populaire
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Visible sur la boutique
        </label>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Enregistrement..." : product ? "Mettre à jour" : "Créer le produit"}
      </button>
    </form>
  );
}
