import Link from "next/link";

function pageHref(current, page) {
  const params = new URLSearchParams();
  if (current.search) params.set("search", current.search);
  if (current.category) params.set("category", current.category);
  if (current.brand) params.set("brand", current.brand);
  if (current.ordering) params.set("ordering", current.ordering);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? "/products?" + query : "/products";
}

const base = "rounded-lg border px-4 py-2 text-sm font-medium transition";
const enabled = base + " border-card-border bg-card text-subtitle hover:border-primary hover:text-primary";
const disabled = base + " cursor-not-allowed border-border-subtle text-muted opacity-50";

export function Pagination({ current, totalPages }) {
  if (totalPages <= 1) return null;

  const page = current.page;
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-3">
      {isFirst ? (
        <span className={disabled}>← Anterior</span>
      ) : (
        <Link href={pageHref(current, page - 1)} className={enabled}>
          ← Anterior
        </Link>
      )}

      <span className="text-sm text-body">
        Página <span className="font-semibold text-title">{page}</span> de {totalPages}
      </span>

      {isLast ? (
        <span className={disabled}>Siguiente →</span>
      ) : (
        <Link href={pageHref(current, page + 1)} className={enabled}>
          Siguiente →
        </Link>
      )}
    </nav>
  );
}