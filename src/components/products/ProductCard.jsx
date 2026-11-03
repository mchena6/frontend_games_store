import Link from "next/link";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }) {
  return (
    <Link
      href={"/products/" + product.id}
      className="group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card transition duration-200 hover:-translate-y-1 hover:border-card-border-hover hover:bg-card-hover hover:shadow-neon-cyan"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface text-sm text-muted">
            Sin imagen
          </div>
        )}

        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-canvas/80 px-3 py-1 text-xs font-medium capitalize text-primary">
            {product.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {product.brand.name}
          </span>
        )}
        <h2 className="line-clamp-2 font-semibold text-title">{product.name}</h2>
        <p className="mt-auto pt-2 text-xl font-bold text-accent">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}