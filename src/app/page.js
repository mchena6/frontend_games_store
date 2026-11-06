import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/app/actions";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

export const metadata = {
  title: "GAME OVER | Hardware de Alto Rendimiento",
  description: "Equipá tu setup con los mejores componentes de hardware.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden border-b border-border-subtle bg-surface">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase mb-4 shadow-neon-cyan">
            Hardware Store
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-black text-title tracking-tighter leading-tight">
            BIENVENIDO A <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-orange">
              GAME OVER
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-body max-w-2xl mx-auto leading-relaxed">
            Descubre el catálogo definitivo de componentes. Desde placas de video de última generación hasta periféricos competitivos para armar la PC de tus sueños.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/products"
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-4 px-10 rounded-xl transition-all shadow-neon-cyan hover:scale-105 text-lg uppercase tracking-wider"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            <div className="px-4 py-2">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="text-title font-bold mb-1">Envíos a todo el país</h3>
              <p className="text-muted text-sm">Llegamos a la puerta de tu casa</p>
            </div>
            <div className="px-4 py-2 pt-8 md:pt-2">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-title font-bold mb-1">Garantía Oficial</h3>
              <p className="text-muted text-sm">Productos 100% originales</p>
            </div>
            <div className="px-4 py-2 pt-8 md:pt-2">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="text-title font-bold mb-1">Pagos Seguros</h3>
              <p className="text-muted text-sm">A través de Mercado Pago</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

