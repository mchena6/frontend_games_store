import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  getProduct,
  getProductSpecifications,
  getProductRating,
  getReviews,
} from "@/app/actions";
import { getToken } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { ProductReviews } from "@/components/products/ProductReviews";
import Image from "next/image";

export const metadata = {
  title: "Producto | Games Store",
};

export default function ProductDetailPage({ params }) {
  return (
    <div className="space-y-6">
      <Link
        href="/products"
        className="inline-block text-sm text-body transition hover:text-primary"
      >
        ← Volver a productos
      </Link>

      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }) {
  const { id } = await params;

  const [product, specifications, rating, reviews, token, email] =
    await Promise.all([
      getProduct(id),
      getProductSpecifications(id),
      getProductRating(id),
      getReviews(id),
      getToken(),
      cookies().then((jar) => jar.get("email")?.value ?? ""),
    ]);

  if (!product) notFound();

  return (
    <div className="space-y-10">
      <article className="grid gap-10 md:grid-cols-2">
        {/* Informacion principal del producto */}
        <div className="overflow-hidden rounded-2xl border border-card-border bg-white">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-contain p-6"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-surface text-muted">
              Sin imagen
            </div>
          )}
        </div>

        {/* Categoria y marca del producto */}
        <div className="flex flex-col gap-5">
          {(product.category || product.brand) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {product.category && (
                <Link
                  href={"/products?category=" + product.category.id}
                  className="rounded-full border border-border-subtle px-3 py-1 capitalize text-primary transition hover:border-primary"
                >
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <Link
                  href={"/products?brand=" + product.brand.id}
                  className="rounded-full border border-border-subtle px-3 py-1 text-subtitle transition hover:border-primary hover:text-primary"
                >
                  {product.brand.name}
                </Link>
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold text-title sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating y precio */}
          <Rating rating={rating} />

          <p className="text-3xl font-bold text-accent">
            {formatPrice(product.price)}
          </p>

          {/* Descripcion */}
          {product.description && (
            <div className="rounded-2xl border border-border-subtle bg-surface p-5">
              <h2 className="mb-2 font-semibold text-subtitle">Descripción</h2>
              <p className="whitespace-pre-line leading-relaxed text-body">
                {product.description}
              </p>
            </div>
          )}

          {/* Boton para agregar al carrito */}
          <button
            type="button"
            className="mt-auto rounded-xl bg-primary py-3 text-lg font-semibold text-primary-fg transition hover:bg-primary-hover hover:shadow-neon-cyan"
          >
            Agregar al carrito
          </button>
        </div>
      </article>
      {/* Especificacion del producto */}
      {specifications.length > 0 && (
        <section className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-title">
            Especificaciones
          </h2>
          <dl className="divide-y divide-border-subtle">
            {specifications.map((spec) => (
              <div key={spec.id} className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">{spec.name}</dt>
                <dd className="text-subtitle">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Reviews del producto */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        isLoggedIn={!!token}
        currentUserEmail={email}
      />
    </div>
  );
}
// OBtener y mostrar rating
function Rating({ rating }) {
  if (!rating) {
    return <p className="text-sm text-muted">Todavía no tiene reseñas</p>;
  }

  const filled = Math.round(rating.average);
  const empty = 5 - filled;

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="text-lg tracking-wide">
        <span className="text-accent">{"★".repeat(filled)}</span>
        <span className="text-border-subtle">{"★".repeat(empty)}</span>
      </span>
      <span className="text-sm text-body">
        <span className="sr-only">Puntuación: </span>
        {rating.average.toFixed(1)} ({rating.total}{" "}
        {rating.total === 1 ? "reseña" : "reseñas"})
      </span>
    </div>
  );
}

// Skeleton para estado de carga del producto
function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando producto"
      className="grid animate-pulse gap-10 md:grid-cols-2"
    >
      <div className="aspect-square rounded-2xl bg-card" />
      <div className="space-y-5">
        <div className="h-6 w-40 rounded-full bg-card" />
        <div className="h-10 w-3/4 rounded bg-card" />
        <div className="h-8 w-1/3 rounded bg-card" />
        <div className="h-32 rounded-2xl bg-card" />
      </div>
    </div>
  );
}
