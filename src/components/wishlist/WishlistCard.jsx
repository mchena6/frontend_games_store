import Link from "next/link";
import { RemoveItem } from "@/components/wishlist/RemoveItem";
import { formatPrice } from "@/lib/format";

export function WishlistCard({ item }) {
  const { product } = item;

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-card-border bg-card transition hover:border-card-border-hover hover:bg-card-hover hover:shadow-neon-cyan">
      {/* Boton para eliminar producto de la wishlist */}
      <RemoveItem productId={product.id} />

      {/* Nombre y descripcion */}
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="aspect-square overflow-hidden bg-surface">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </div>

        {/* Informacion del producto */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs">
            {product.brand && (
              <span className="font-semibold text-accent">
                {product.brand.name}
              </span>
            )}
            {product.category && (
              <>
                <span className="text-muted">•</span>
                <span className="text-muted">{product.category.name}</span>
              </>
            )}
          </div>
          <h2 className="line-clamp-2 font-semibold text-title">
            {product.name}
          </h2>

          <p className="mt-auto pt-2 text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </li>
  );
}
