"use client";

import { useTransition } from "react";
import { eliminarItemWishlist } from "@/app/actions";

export function RemoveItem({ productId }) {
  const [pending, startTransition] = useTransition();

  // Eliminar producto de la wishlist
  const handleEliminarItem = () => {
    startTransition(async () => {
      const res = await eliminarItemWishlist(productId);
      if (res?.error) alert(res.error);
    });
  };

  return (
    // Boton para eliminar producto
    <button
      onClick={() => handleEliminarItem()}
      disabled={pending}
      aria-label="Quitar de la wishlist"
      className="absolute right-3 top-3 z-10 rounded-full border border-card-border bg-navbar/80 p-2 text-sm text-accent backdrop-blur transition hover:border-accent hover:text-red-500 hover:shadow-neon-orange disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        /* Spinner de carga */
        <svg
          className="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        /* Icono de Papelera */
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
}
