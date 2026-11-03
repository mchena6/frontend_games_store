export function ProductGridSkeleton({ items = 8 }) {
  return (
    <div
      role="status"
      aria-label="Cargando productos"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-card-border bg-card"
        >
          <div className="aspect-square bg-surface" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 rounded bg-border-subtle" />
            <div className="h-4 w-3/4 rounded bg-border-subtle" />
            <div className="h-6 w-1/2 rounded bg-border-subtle" />
          </div>
        </div>
      ))}
    </div>
  );
}