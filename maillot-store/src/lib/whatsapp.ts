import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

/**
 * Construit le message de commande WhatsApp à partir du panier réel.
 * Le numéro doit venir des réglages de la boutique (jamais hardcodé).
 */
export function buildOrderMessage(items: CartItem[]): string {
  const lines = items.map((item) => {
    const sizePart = item.size ? ` — Taille ${item.size}` : "";
    return `• ${item.name}${sizePart} — Quantité ${item.quantity} — ${formatPrice(
      item.price * item.quantity
    )}`;
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return [
    "Bonjour, je souhaite commander :",
    "",
    ...lines,
    "",
    `Total : ${formatPrice(total)}`,
  ].join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
