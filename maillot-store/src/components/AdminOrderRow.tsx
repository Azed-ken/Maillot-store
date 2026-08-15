"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  nouvelle: "bg-blue-50 text-blue-600",
  confirmee: "bg-amber-50 text-amber-600",
  livree: "bg-green-50 text-green-600",
  annulee: "bg-red-50 text-red-600",
};

export default function AdminOrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    startTransition(() => {
      updateOrderStatus(order.id, newStatus);
    });
  };

  return (
    <div className="card-surface overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold">#{order.id.slice(0, 8)}</p>
          <p className="text-xs text-ink-700/60">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{formatPrice(order.total)}</span>
          <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[status])}>
            {STATUS_LABELS[status]}
          </span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-ink-950/5 p-4">
          <div className="space-y-2">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.product_name}
                  {item.size ? ` — Taille ${item.size}` : ""} × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-ink-700">Statut</label>
            <select
              value={status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="input-field max-w-xs"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
