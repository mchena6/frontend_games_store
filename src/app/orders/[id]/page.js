import Link from "next/link";
import { notFound } from "next/navigation";
import { getToken } from "@/lib/auth";
import { getOrderById, cancelarOrder } from "@/app/actions";
import { OrderItem } from "@/components/orders/OrderItem";

export default async function OrderDetailPage({ params }) {
  const token = await getToken();

  // Comporbar que el usuario esta logueado
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
            Inicia sesión para ver el detalle de esta orden.
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

  // Obtener id de la orden
  const { id } = await params;
  const order = await getOrderById(id);

  // Mensaje de error si no se encuentra la orden o no tiene permisos
  if (!order || order.error) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-card border border-border-card max-w-md w-full p-8 rounded-2xl text-center shadow-xl">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-title text-2xl font-bold mb-2">
            Orden no encontrada
          </h1>
          <p className="text-body text-sm mb-6">
            No se pudo encontrar la orden o no tienes permisos para acceder a
            ella.
          </p>
          <Link
            href="/orders"
            className="inline-block bg-primary hover:bg-primary-hover text-primary-fg font-bold py-2.5 px-6 rounded-xl transition-all"
          >
            ← Volver a Mis Órdenes
          </Link>
        </div>
      </main>
    );
  }

  // Formatear fecha de creacion
  const formattedDate = new Date(order.created_at).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Informacion de la orden */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-1 mb-4"
        >
          ← Volver al listado de órdenes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div>
            <h1 className="text-title text-3xl font-black tracking-tight">
              Orden{" "}
              <span className="font-mono text-primary">
                #{order.order_code}
              </span>
            </h1>
            <p className="text-muted text-xs mt-1">
              Registrada el {formattedDate}
            </p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface border border-border-subtle text-subtitle">
            Estado: <span className="text-title uppercase">{order.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Listado de productos comprados */}
        <div className="lg:col-span-2 bg-card border border-border-card rounded-2xl p-6 shadow-xl">
          <h2 className="text-title font-bold text-lg mb-4 pb-2 border-b border-border-subtle">
            Productos Comprados ({order.items?.length || 0})
          </h2>
          <div className="divide-y divide-border-subtle">
            {order.items?.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Informacion de pago */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border-card rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-title font-bold text-base pb-2 border-b border-border-subtle">
              Detalles de Entrega
            </h2>
            {order.payment_id && (
              <div className="text-xs space-y-1 pt-2 border-t border-border-subtle">
                <span className="text-muted block">ID de Pago:</span>
                <span className="text-subtitle font-mono">
                  {order.payment_id}
                </span>
              </div>
            )}
          </div>

          <div className="bg-card border border-border-card rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-title font-bold text-base pb-2 border-b border-border-subtle">
              Resumen de Pago
            </h2>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-title text-sm font-semibold">Total:</span>
              <span className="text-accent text-2xl font-black">
                ${order.total_amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
