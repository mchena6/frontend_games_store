"use client";

import { useTransition, useState } from "react";
import { vaciarCarrito, iniciarCheckout } from "@/app/actions";

export function CartSummary({ cart }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  // Vaciar carrito
  const handleVaciar = () => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas vaciar todos los productos de tu carrito?",
      )
    ) {
      return;
    }
    setErrorMsg("");
    startTransition(async () => {
      const res = await vaciarCarrito(cart.id);
      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  };

  // Checkout con Mercado Pago
  const handleCheckout = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await iniciarCheckout();
      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.init_point) {
        // Redirección a link de Mercado Pago
        window.location.href = res.init_point;
      }
    });
  };

  return (
    <div className="bg-card border border-border-card rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      <h2 className="text-title font-bold text-xl border-b border-border-subtle pb-4">
        Resumen de la Orden
      </h2>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Cantidad de articulos */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-body">
          <span>Cantidad de artículos:</span>
          <span className="text-subtitle font-semibold">
            {cart.total_quantity}
          </span>
        </div>
        {/* Precio total del carrito */}
        <div className="flex justify-between items-baseline pt-4 border-t border-border-subtle">
          <span className="text-title text-base font-bold">Total a Pagar:</span>
          <span className="text-accent text-3xl font-black">
            ${cart.cart_total}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {/* Boton de Comprar -> Redireccion a Checkout de Mercado Pago */}
        <button
          onClick={handleCheckout}
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-6 rounded-xl shadow-neon-cyan transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center text-base"
        >
          {isPending ? "Procesando pago..." : "Comprar Ahora"}
        </button>

        {/* Boton de Vaciar Carrito */}
        <button
          onClick={handleVaciar}
          disabled={isPending}
          className="w-full bg-surface hover:bg-red-500/10 text-muted hover:text-red-400 border border-border-subtle hover:border-red-500/30 font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-sm"
        >
          {isPending ? "Vaciando..." : "Vaciar Carrito"}
        </button>
      </div>
    </div>
  );
}
