import Link from "next/link";
import { getToken } from "@/lib/auth";
import { logout, getMyCart } from "@/app/actions";

export default async function Navbar() {
  const token = await getToken();
  const isLoggedIn = !!token;

  let cart = null;
  if (isLoggedIn) {
    cart = await getMyCart();
  }
  const totalItems = cart?.total_quantity || 0;

  return (
    <nav className="bg-bg-navbar border-b border-card-border text-text-body sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex flex-col font-sans uppercase font-black leading-[0.8] text-2xl tracking-tighter sm:text-3xl"
            >
              <span className="text-brand-cyan">
                G<span className="text-brand-orange">A</span>ME
              </span>
              <span className="text-brand-cyan">
                O<span className="text-brand-orange">V</span>ER
              </span>
            </Link>
          </div>

          <div className="hidden md:flex text-sm font-semibold tracking-wider uppercase">
            <Link
              href="/products"
              className="text-text-subtitle hover:text-primary transition-colors hover:drop-shadow-neon-cyan"
            >
              Productos
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/wishlist"
                  className="flex items-center hover:text-white transition-colors gap-2 text-sm font-medium"
                >
                  <span className="text-lg">❤️</span>{" "}
                  <span className="hidden sm:inline">Lista de deseos</span>
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center hover:text-white transition-colors gap-2 text-sm font-medium"
                >
                  <span className="text-lg">📦</span>{" "}
                  <span className="hidden sm:inline">Órdenes</span>
                </Link>

                <Link
                  href="/shopping-cart"
                  className="flex items-center hover:text-white transition-colors gap-2 text-sm font-medium"
                >
                  <span className="text-lg">🛒</span>{" "}
                  <span className="hidden sm:inline">Carrito</span>
                  {totalItems > 0 && (
                    <span className="bg-brand-cyan text-primary-fg text-xs font-bold px-1.5 py-0.5 rounded-full shadow-neon-cyan">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="border border-red-500/30 text-red-400 bg-red-950/10 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-white transition-all text-sm font-semibold uppercase tracking-wider"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary-hover text-primary-fg px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
