import { Suspense } from "react";
import { getProducts, getCategories, getBrands } from "@/app/actions";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { SearchBar } from "@/components/products/SearchBar";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/products/Pagination";

export const metadata = {
  title: "Productos | Games Store",
};

export default function ProductsPage({ searchParams }) {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-title">Productos</h1>
          <p className="text-body">Equipate para tu próxima partida.</p>
        </div>

        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductCatalog searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

function readParam(params, key) {
  return typeof params[key] === "string" ? params[key] : "";
}

async function ProductCatalog({ searchParams }) {
  const params = await searchParams;
  const current = {
    page: Math.max(1, Number(readParam(params, "page")) || 1),
    search: readParam(params, "search"),
    category: readParam(params, "category"),
    brand: readParam(params, "brand"),
    ordering: readParam(params, "ordering"),
  };

  const [{ results, count, totalPages }, categories, brands] = await Promise.all([
    getProducts(current),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="space-y-6">
      <ProductFilters categories={categories} brands={brands} current={current} />

      {results.length === 0 ? (
        <div className="rounded-2xl border border-card-border bg-card px-6 py-16 text-center">
          <p className="text-lg font-semibold text-subtitle">
            {current.search
              ? "No encontramos productos para \"" + current.search + "\"."
              : "No hay productos que coincidan con los filtros."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted">
            {count} {count === 1 ? "producto" : "productos"}
            {current.search ? " para \"" + current.search + "\"" : ""}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination current={current} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}