import Link from "next/link";
import { getToken } from "@/lib/auth";
import { getMyCart } from "@/app/actions";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";

export const metadata = {
  title: "Carrito de Compras | Games Store",
  description: "Revisa tu carrito de compras.",
};

export default async function ShoppingCartPage() {
  const token = await getToken();

  // Si el usuario no está logueado, redireccionar a la ruta login con Link
  if (!token) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-card border border-border-card max-w-md w-full p-8 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-primary text-2xl font-bold">
            🔒
          </div>
          <h1 className="text-title text-2xl font-bold mb-2">
            Acceso Requerido
          </h1>
          <p className="text-body text-sm mb-6 leading-relaxed">
            Debes iniciar sesión con tu cuenta para acceder a tu carrito de
            compras y continuar con tu pedido.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-neon-cyan text-center text-sm"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  // Obtener la informacion del carrito
  const cart = await getMyCart();
  const items = cart?.cartitems || [];

  // Si el carrito no tiene productos, mostrar mensaje
  if (!cart || items.length === 0) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-card border border-border-card max-w-lg w-full p-10 rounded-2xl text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-accent text-3xl">
            🛒
          </div>
          <h1 className="text-title text-2xl font-bold mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-body text-base mb-8 leading-relaxed">
            Aún no has añadido productos a tu carrito. Explora nuestro catálogo
            y descubre las mejores ofertas.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-neon-cyan hover:scale-[1.02] text-sm"
          >
            Explora los productos disponibles!
          </Link>
        </div>
      </main>
    );
  }

  // Mostrar carrito con items
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-title text-3xl font-extrabold tracking-tight">
            Carrito de Compras
          </h1>
          <p className="text-muted text-xs mt-1">
            Código de orden:{" "}
            <span className="text-subtitle font-mono font-medium">
              {cart.cart_code}
            </span>
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-1"
        >
          ← Continuar comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Listado de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Resumen de totales con botones de Vaciar y Comprar */}
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary cart={cart} />
        </div>
      </div>
    </main>
  );
}
