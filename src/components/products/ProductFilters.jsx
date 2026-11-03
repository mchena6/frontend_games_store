"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ORDERING_OPTIONS = [
  { value: "", label: "Por defecto" },
  { value: "price", label: "Menor precio" },
  { value: "-price", label: "Mayor precio" },
  { value: "name", label: "Nombre (A-Z)" },
  { value: "-name", label: "Nombre (Z-A)" },
];

const selectClass =
  "w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-subtitle outline-none transition focus:border-primary focus:shadow-neon-cyan";

const labelClass = "text-xs font-medium uppercase tracking-wider text-muted";

export function ProductFilters({ categories, brands, current }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(params) {
    params.delete("page");
    const query = params.toString();
    router.push(query ? "/products?" + query : "/products");
  }

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    goTo(params);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    goTo(params);
  }

  const hasFilters = current.category || current.brand || current.ordering;

  return (
    <div className="grid gap-4 rounded-2xl border border-border-subtle bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <div className="space-y-1">
        <label htmlFor="filter-category" className={labelClass}>
          Categoría
        </label>
        <select
          id="filter-category"
          value={current.category}
          onChange={(e) => update("category", e.target.value)}
          className={selectClass}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-brand" className={labelClass}>
          Marca
        </label>
        <select
          id="filter-brand"
          value={current.brand}
          onChange={(e) => update("brand", e.target.value)}
          className={selectClass}
        >
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-ordering" className={labelClass}>
          Ordenar por
        </label>
        <select
          id="filter-ordering"
          value={current.ordering}
          onChange={(e) => update("ordering", e.target.value)}
          className={selectClass}
        >
          {ORDERING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!hasFilters}
        onClick={clearFilters}
        className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-subtitle transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Limpiar filtros
      </button>
    </div>
  );
}