export type ProductKind = "domicile" | "exterieur" | "third";
export type OrderStatus = "nouvelle" | "confirmee" | "livree" | "annulee";
export type CategoryType = "club" | "selection";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  country_flag: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  category?: Category | null;
  kind: ProductKind;
  sizes: string[];
  photos: string[];
  is_new: boolean;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface StoreSettings {
  id: boolean;
  store_name: string;
  slogan: string;
  description: string;
  logo_url: string | null;
  whatsapp_number: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  footer_text: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  customer_note: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  size: string | null;
  quantity: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  photo: string | null;
  size: string | null;
  quantity: number;
  stock: number;
}

export const KIND_LABELS: Record<ProductKind, string> = {
  domicile: "Domicile",
  exterieur: "Extérieur",
  third: "Third",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  livree: "Livrée",
  annulee: "Annulée",
};
