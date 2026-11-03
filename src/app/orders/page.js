import Link from "next/link";
import { getToken } from "@/lib/auth";
import { getOrders } from "@/app/actions";
import { OrderCard } from "@/components/orders/OrderCard";

export const metadata = {
  title: "Mis Órdenes | Games Store",
  description: "Historial de pedidos y compras",
};

export default async function OrdersPage() {
  const token = await getToken();

  // Comprobar si el usuario esta logueado
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
            Debes iniciar sesión para consultar tu historial de órdenes y
            compras.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-neon-cyan text-sm"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  const orders = await getOrders();

  // Mensaje si no posee ordenes registradas
  if (!orders || orders.length === 0) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-card border border-border-card max-w-lg w-full p-10 rounded-2xl text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-accent text-3xl">
            📦
          </div>
          <h1 className="text-title text-2xl font-bold mb-2">
            Aún no tienes órdenes
          </h1>
          <p className="text-body text-base mb-8 leading-relaxed">
            Cuando completes una compra desde tu carrito, podrás revisar aquí el
            estado de tu pedido y los detalles de entrega.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-neon-cyan hover:scale-[1.02] text-sm"
          >
            Ver Catálogo de Games Store
          </Link>
        </div>
      </main>
    );
  }

  // Listado de ordenes
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-title text-3xl font-extrabold tracking-tight">
            Mis Órdenes
          </h1>
          <p className="text-muted text-sm mt-1">
            Historial de compras realizadas en Games Store
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-1"
        >
          ← Volver a la tienda
        </Link>
      </div>
      {/* Ordenes */}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}
