"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { agregarAWishlist } from "@/app/actions";

export function WishlistButton({ productId, isLoggedIn }) {
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Si no inici0 sesion, mostramos un link al login
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="block w-full rounded-xl border border-card-border py-3 text-center text-sm font-semibold text-subtitle transition hover:border-accent hover:text-accent"
      >
        Iniciá sesión para guardar en tu wishlist
      </Link>
    );
  }

  // Agregar a la wishlist
  function handleClick() {
    setMensaje(null);
    setError(null);
    startTransition(async () => {
      const res = await agregarAWishlist(productId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setMensaje("Producto agregado a tu wishlist.");
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="w-full rounded-xl border border-accent py-3 text-lg font-semibold text-accent transition hover:bg-accent hover:text-accent-fg hover:shadow-neon-orange disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Agregando..." : "Agregar a la wishlist"}
      </button>

      {mensaje && <p className="text-sm text-primary">{mensaje}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}