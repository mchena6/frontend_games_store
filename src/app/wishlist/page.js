import Link from "next/link";
import { getToken } from "@/lib/auth";
import { Suspense } from "react";
import { connection } from "next/server";
import { getMyWishlist } from "@/app/actions";
import { WishlistCard } from "@/components/wishlist/WishlistCard";

export const metadata = { title: "Mi Wishlist" };

export const instant = false;

export default async function WishlistPage() {
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
            Debes iniciar sesión con tu cuenta para acceder a tu lista de
            deseos.
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

  return (
    // Mensaje de carga
    <main className="mx-auto max-w-7xl px-4 py-10 min-h-[75vh]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <p className="text-muted font-medium animate-pulse">
              Cargando tu lista de deseos…
            </p>
          </div>
        }
      >
        <WishlistContent />
      </Suspense>
    </main>
  );
}

async function WishlistContent() {
  await connection();
  // Obtener wishlist con items
  const items = (await getMyWishlist()) || [];

  // Mostrar mensaje si la wishlist esta vacia
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <div className="bg-card border border-border-card max-w-lg w-full p-10 rounded-2xl text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-red-500 text-3xl">
            ❤️
          </div>
          <h1 className="text-title text-2xl font-bold mb-2">
            Tu lista de deseos está vacía
          </h1>
          <p className="text-body text-base mb-8 leading-relaxed">
            Aún no has guardado ningún producto. Explora nuestro catálogo y
            guarda tus favoritos para no perderlos de vista.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-neon-cyan hover:scale-[1.02] text-sm"
          >
            Explorar el catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mostrar titulo y cantidad de productos */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between border-b border-border-subtle pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-title tracking-tight">
            Mi Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted font-medium">
            {items.length}{" "}
            {items.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-1"
        >
          ← Seguir explorando
        </Link>
      </header>

      {/* Mostrar items de la wishlist */}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
