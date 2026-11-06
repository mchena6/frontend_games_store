"use client";

import { useTransition } from "react";
import { eliminarItem } from "@/app/actions";

export default function DeleteCartItem({ cartItemId }) {
  const [isPending, startTransition] = useTransition();

  // Funcion para eliminar producto del carrito
  const handleRemove = () => {
    startTransition(async () => {
      const res = await eliminarItem(cartItemId);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    // Boton para eliminar producto del carrito
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      aria-label="Quitar del carrito"
      className="p-2 text-red-500 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        /* Spinner loading */
        <svg
          className="w-5 h-5 animate-spin"
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
          className="w-5 h-5"
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
