"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { incrementarItem, decrementarItem } from "@/app/actions";

export function CartItemRow({ item }) {
  const [isPending, startTransition] = useTransition();
  const product = item?.product || {};

  const handleIncrement = () => {
    startTransition(async () => {
      await incrementarItem(item.id);
    });
  };

  const handleDecrement = () => {
    startTransition(async () => {
      await decrementarItem(item.id);
    });
  };

  return (
    <article className="bg-card border border-border-card hover:border-border-card-hover rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all">
      {/* Imagen del producto */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface shrink-0 border border-border-subtle">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name || "Producto sin nombre"}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs font-semibold">
            Sin imagen
          </div>
        )}
      </div>

      {/* Informacion del producto */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider block">
          {product.category?.name || "Producto sin categoría"}
        </span>
        <Link
          href={`/products/${product.id}`}
          className="text-title font-bold text-lg truncate mt-0.5 overflow-hidden whitespace-nowrap block hover:text-primary transition"
        >
          {product.name || "Producto sin nombre"}
        </Link>
        {product.brand?.name && (
          <p className="text-muted text-xs">Marca: {product.brand.name}</p>
        )}
        <p className="text-muted text-xs mt-1">
          Precio unitario:{" "}
          <span className="text-subtitle font-medium">${product.price}</span>
        </p>
      </div>

      {/* Selector de cantidad (+ / -) */}
      <div className="flex items-center gap-3 bg-surface border border-border-subtle px-3 py-1.5 rounded-lg">
        <button
          onClick={handleDecrement}
          disabled={isPending || item.quantity <= 1}
          className="text-subtitle hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
          title="-1"
          aria-label="Restar cantidad"
        >
          -
        </button>
        <span className="text-title font-bold text-sm min-w-6 text-center">
          {isPending ? "..." : item.quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={isPending}
          className="text-subtitle hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
          title="+1"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {/* Subtotal del item */}
      <div className="text-right min-w-22">
        <span className="text-muted text-xs block">Subtotal</span>
        <span className="text-accent font-extrabold text-lg">
          ${item.sub_total}
        </span>
      </div>
    </article>
  );
}
