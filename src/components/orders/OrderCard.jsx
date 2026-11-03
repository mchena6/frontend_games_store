"use client";

import { useTransition } from "react";
import { OrderItem } from "./OrderItem";
import { cancelarOrder } from "@/app/actions";
import Link from "next/link";

// Mapeo de estados de una orden a etiquetas y estilos
const STATUS_CONFIG = {
  Pending: {
    label: "Pendiente de Pago",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  Paid: {
    label: "Pagado",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  Shipped: {
    label: "En Camino",
    bg: "bg-cyan-500/10",
    text: "text-primary",
    border: "border-cyan-500/30",
  },
  Delivered: {
    label: "Entregado",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  Canceled: {
    label: "Cancelado",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
};

export function OrderCard({ order }) {
  const [isPending, startTransition] = useTransition();
  const statusInfo = STATUS_CONFIG[order.status] || {
    label: order.status,
    bg: "bg-surface",
    text: "text-muted",
    border: "border-border-subtle",
  };

  //   Formatear fecha de creacion
  const formattedDate = new Date(order.created_at).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Cancelar orden pendiente
  const handleCancelar = () => {
    if (!window.confirm("¿Seguro que deseas cancelar esta orden pendiente?"))
      return;
    startTransition(async () => {
      await cancelarOrder(order.id);
    });
  };

  return (
    <article className="bg-card border border-border-card hover:border-border-card-hover rounded-2xl overflow-hidden transition-all shadow-lg">
      {/* Codigo de la orden y fecha */}
      <div className="p-5 sm:p-6 bg-surface/50 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-muted text-xs">Orden</span>
            <Link
              href={`/orders/${order.id}`}
              className="text-title hover:text-primary font-mono font-bold text-sm sm:text-base transition-colors"
            >
              #{order.order_code}
            </Link>
          </div>
          <p className="text-muted text-xs">Fecha: {formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mostrar estado */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
          >
            {statusInfo.label}
          </span>

          {/* Boton para cancelar si esta en estado Pending */}
          {order.status === "Pending" && (
            <button
              onClick={handleCancelar}
              disabled={isPending}
              className="text-xs text-red-400 hover:text-red-300 hover:underline disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending ? "Cancelando..." : "Cancelar"}
            </button>
          )}
        </div>
      </div>

      {/* Lista de productos de la orden */}
      <div className="p-5 sm:p-6 space-y-1">
        {order.items?.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      {/* Informacion de pagos */}
      <div className="px-5 py-4 sm:px-6 bg-surface/30 border-t border-border-subtle flex items-center justify-between">
        <div className="text-xs text-muted">
          <span>{order.items?.length || 0} productos</span>
          {order.payment_id && (
            <span className="block text-[11px] font-mono mt-0.5">
              Ref de pago: {order.payment_id}
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-muted text-xs block">Total Pagado:</span>
          <span className="text-accent text-xl sm:text-2xl font-black">
            ${order.total_amount}
          </span>
        </div>
      </div>
    </article>
  );
}
