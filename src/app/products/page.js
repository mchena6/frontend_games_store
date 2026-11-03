import { Suspense } from "react";
import { getProducts } from "@/app/actions";
import { ProductCard } from "@/components/products/ProductCard";

export const metadata = {
  title: "Productos | Games Store",
};

export default function ProductsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-title">Productos</h1>

      <Suspense fallback={<p className="text-body">Cargando productos...</p>}>
        <ProductList />
      </Suspense>
    </section>
  );
}

async function ProductList() {
  const { results, count } = await getProducts();

  if (results.length === 0) {
    return <p className="text-body">Todavía no hay productos cargados.</p>;
  }

  return (
    <>
      <p className="text-sm text-muted">
        {count} {count === 1 ? "producto" : "productos"}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}