"use client";

import { useState, useTransition } from "react";
import { agregarAlCarrito } from "@/app/actions";

export default function AddToCart({ product, token }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  //   Funcion para agregar el producto al carrito
  const handleAddToCart = async () => {
    setErrorMsg("");

    // Verificar si el usuario esta logueado
    if (!token) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    // Agregar el producto al carrito
    try {
      startTransition(async () => {
        const res = await agregarAlCarrito(product.id);
        if (res?.error) {
          setErrorMsg(res.error);
        }
      });
    } catch (error) {
      setErrorMsg("Ocurrió un error al agregar el producto al carrito.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Boton para agregar al carrito */}
      <button
        type="button"
        className="mt-auto rounded-xl bg-primary py-3 px-6 text-lg font-semibold text-primary-fg transition hover:bg-primary-hover hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? "Agregando..." : "Agregar al carrito"}
      </button>

      {/* Mostrar mensaje de error */}
      {errorMsg && (
        <p className="text-sm font-medium text-red-500 text-center">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
