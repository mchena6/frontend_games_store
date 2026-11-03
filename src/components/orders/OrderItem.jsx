import Image from "next/image";

export function OrderItem({ item }) {
  const product = item?.product || {};

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-b-0">
      {/* Imagen del producto */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface shrink-0 border border-border-subtle">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name || "Producto sin nombre"}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Informacion del producto */}
      <div className="flex-1 min-w-0">
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider block">
          {product.category?.name || "Juego"}
        </span>
        <h4 className="text-title font-semibold text-sm truncate">
          {product.name || "Videojuego"}
        </h4>
        <p className="text-muted text-xs mt-0.5">
          Cantidad:{" "}
          <span className="text-subtitle font-bold">{item.quantity}</span> × $
          {item.price}
        </p>
      </div>

      {/* Subtotal */}
      <div className="text-right shrink-0">
        <span className="text-accent font-bold text-sm sm:text-base">
          ${item.sub_total}
        </span>
      </div>
    </div>
  );
}
