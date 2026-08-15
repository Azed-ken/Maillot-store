"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { updateStoreSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import type { StoreSettings } from "@/lib/types";

export default function StoreSettingsForm({ settings }: { settings: StoreSettings }) {
  const [storeName, setStoreName] = useState(settings.store_name);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [description, setDescription] = useState(settings.description);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || "");
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [facebook, setFacebook] = useState(settings.facebook_url || "");
  const [instagram, setInstagram] = useState(settings.instagram_url || "");
  const [tiktok, setTiktok] = useState(settings.tiktok_url || "");
  const [footerText, setFooterText] = useState(settings.footer_text);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `logo-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("store-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("store-assets").getPublicUrl(path);
      setLogoUrl(data.publicUrl);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateStoreSettings({
      store_name: storeName,
      slogan,
      description,
      logo_url: logoUrl || null,
      whatsapp_number: whatsapp,
      facebook_url: facebook || null,
      instagram_url: instagram || null,
      tiktok_url: tiktok || null,
      footer_text: footerText,
    });

    setSaving(false);
    setMessage(result.ok ? "Paramètres enregistrés." : result.error || "Erreur.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {message && (
        <p className="rounded-lg bg-ink-950/5 px-3 py-2 text-sm text-ink-900">{message}</p>
      )}

      <div>
        <label className="mb-2 block text-xs font-medium text-ink-700">Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-ink-950/10 bg-ink-800/5">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" fill sizes="64px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl">⚽</div>
            )}
          </div>
          <label className="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Changer le logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">Nom de la boutique</label>
        <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="input-field" required />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">Slogan</label>
        <input value={slogan} onChange={(e) => setSlogan(e.target.value)} className="input-field" />
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

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">
          Numéro WhatsApp (avec indicatif, sans espaces — ex : 22990000000)
        </label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="input-field" required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Facebook (URL)</label>
          <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Instagram (URL)</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">TikTok (URL)</label>
          <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-700">Texte du footer (copyright)</label>
        <input value={footerText} onChange={(e) => setFooterText(e.target.value)} className="input-field" />
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}
