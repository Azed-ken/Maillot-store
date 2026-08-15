import { getStoreSettings } from "@/lib/settings";
import StoreSettingsForm from "@/components/StoreSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Paramètres de la boutique</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        Ces informations sont utilisées partout sur le site (header, footer, commandes WhatsApp).
      </p>
      <div className="mt-6">
        <StoreSettingsForm settings={settings} />
      </div>
    </div>
  );
}
