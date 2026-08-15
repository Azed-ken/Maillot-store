"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createCategory, updateCategory, deleteCategory, type CategoryInput } from "@/lib/actions/categories";
import type { Category, CategoryType } from "@/lib/types";

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("club");
  const [flag, setFlag] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing("new");
    setName("");
    setType("club");
    setFlag("");
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setType(cat.type);
    setFlag(cat.country_flag || "");
  };

  const close = () => setEditing(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const input: CategoryInput = {
      name: name.trim(),
      type,
      country_flag: flag.trim() || null,
      sort_order: editing !== "new" && editing ? editing.sort_order : categories.length + 1,
    };

    if (editing === "new") {
      await createCategory(input);
    } else if (editing) {
      await updateCategory(editing.id, input);
    }

    setSaving(false);
    close();
    router.refresh();
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Supprimer "${cat.name}" ? Les produits liés perdront leur catégorie.`)) return;
    await deleteCategory(cat.id);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Catégories</h1>
        <button onClick={openNew} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 max-w-md space-y-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{editing === "new" ? "Nouvelle catégorie" : "Modifier"}</p>
            <button type="button" onClick={close}><X size={16} /></button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">Nom (ex : Real Madrid, France)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as CategoryType)} className="input-field">
                <option value="club">Club</option>
                <option value="selection">Sélection nationale</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">Drapeau (emoji, facultatif)</label>
              <input value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="🇧🇯" className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      )}

      <div className="card-surface mt-6 divide-y divide-ink-950/5">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium">
                {cat.country_flag ? `${cat.country_flag} ` : ""}
                {cat.name}
              </p>
              <p className="text-xs text-ink-700/50">{cat.type === "club" ? "Club" : "Sélection nationale"}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-950/5">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {!categories.length && (
          <p className="py-10 text-center text-sm text-ink-700/50">Aucune catégorie pour le moment.</p>
        )}
      </div>
    </div>
  );
}
