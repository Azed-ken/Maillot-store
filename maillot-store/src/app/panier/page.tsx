import { getStoreSettings } from "@/lib/settings";
import CartClient from "@/components/CartClient";

export default async function CartPage() {
  const settings = await getStoreSettings();
  return <CartClient whatsappNumber={settings.whatsapp_number} />;
}
