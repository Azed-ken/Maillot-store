import Link from "next/link";
import { MessageCircle, Facebook, Instagram } from "lucide-react";
import type { StoreSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: StoreSettings }) {
  const year = new Date().getFullYear();
  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, "")}`;

  return (
    <footer className="border-t border-ink-950/5 bg-ink-950 text-white/80">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-display text-lg font-bold text-white">{settings.store_name}</p>
          <p className="mt-2 text-sm leading-relaxed">{settings.slogan}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/catalogue" className="hover:text-white">Catalogue</Link></li>
            <li><Link href="/catalogue?type=club" className="hover:text-white">Clubs</Link></li>
            <li><Link href="/catalogue?type=selection" className="hover:text-white">Sélections</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Suivez-nous</p>
          <div className="mt-3 flex gap-3">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-white">
                <Facebook size={18} />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white">
                <Instagram size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-app text-xs text-white/50">
          {settings.footer_text || `© ${year} ${settings.store_name}. Tous droits réservés.`}
        </p>
      </div>
    </footer>
  );
}
