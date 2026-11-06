"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/app/validations/ReviewSchema";
import { crearReview, editarReview, borrarReview } from "@/app/actions";

// Formatear
function formatearFecha(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Mostrar estrellas segun el rating
function Stars({ value }) {
  const filled = Math.round(Number(value) || 0);
  const empty = Math.max(0, 5 - filled);
  return (
    <span aria-hidden="true" className="tracking-wide">
      <span className="text-accent">{"★".repeat(filled)}</span>
      <span className="text-border-subtle">{"★".repeat(empty)}</span>
    </span>
  );
}

export function ProductReviews({
  productId,
  reviews,
  isLoggedIn,
  currentUserEmail,
}) {
  const [apiError, setApiError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Verificar que el usuario logueado ya haya publicado una reseña
  const owner = reviews.find(
    (item) => item.user?.toLowerCase() === currentUserEmail?.toLowerCase(),
  );

  // Resolver con zod y react-hook-form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, review: "" },
  });

  // Editar reseña
  function empezarEdicion() {
    if (!owner) return;
    setApiError(null);
    setEditing(true);
    reset({ rating: owner.rating, review: owner.review });
  }

  // Cancelar edición
  function cancelarEdicion() {
    setApiError(null);
    setEditing(false);
    reset({ rating: 0, review: "" });
  }

  // Guardar cambios o crear reseña
  const onSubmit = (data) => {
    setApiError(null);
    startTransition(async () => {
      const res = editing
        ? await editarReview(owner.id, productId, data)
        : await crearReview(productId, data);
      if (res?.error) {
        setApiError(res.error);
        return;
      }
      setEditing(false);
      reset({ rating: 0, review: "" });
    });
  };

  // Borrar reseña
  function handleBorrar(reviewId) {
    if (!window.confirm("¿Seguro que deseas borrar tu reseña?")) return;
    setApiError(null);
    startTransition(async () => {
      const res = await borrarReview(reviewId, productId);
      if (res?.error) setApiError(res.error);
    });
  }

  // Mostrar formulario si el usuario está logueado y no es dueño de la reseña o esta editando
  const mostrarFormulario = isLoggedIn && (!owner || editing);

  return (
    <section className="rounded-2xl border border-card-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-title">Reseñas</h2>

      {/* Mensaje sin reviews */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted">Todavía no hay reseñas.</p>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {/* Lista de reviews */}
          {reviews.map((item) => {
            const current_autor =
              isLoggedIn &&
              item.user?.trim().toLowerCase() ===
                currentUserEmail?.trim().toLowerCase() &&
              !editing;
            return (
              // Fecha
              <li key={item.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-subtitle">{item.user}</p>
                  <p className="text-xs text-muted">
                    {formatearFecha(item.created)}
                  </p>
                </div>
                {/* Rating */}
                <p className="mt-1">
                  <Stars value={item.rating} />
                  <span className="sr-only">{item.rating} de 5</span>
                </p>
                {/* Review */}
                <p className="mt-2 whitespace-pre-line leading-relaxed text-body">
                  {item.review}
                </p>
                {current_autor && (
                  <div className="mt-3 flex gap-3">
                    {/* Boton para editar */}
                    <button
                      type="button"
                      onClick={empezarEdicion}
                      disabled={isPending}
                      className="text-sm font-medium text-primary transition hover:text-primary-hover disabled:opacity-50"
                    >
                      Editar
                    </button>
                    {/* Boton para borrar */}
                    <button
                      type="button"
                      onClick={() => handleBorrar(item.id)}
                      disabled={isPending}
                      className="text-sm font-medium text-accent transition hover:text-accent-hover disabled:opacity-50"
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Mensaje para usuarios no logueados */}
      {!isLoggedIn && (
        <p className="mt-6 text-sm text-body">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Inicia sesión
          </Link>{" "}
          para publicar una reseña.
        </p>
      )}

      {/* Mensaje para usuario que ya publico reseña */}
      {isLoggedIn && owner && !editing && (
        <p className="mt-6 text-sm text-muted">
          Ya publicaste tu reseña de este producto.
        </p>
      )}

      {/* Mensaje de error de la API */}
      {apiError && !mostrarFormulario && (
        <p className="mt-4 text-sm text-accent">{apiError}</p>
      )}

      {/* Formulario para publicar/editar review */}
      {mostrarFormulario && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4 rounded-2xl border border-border-subtle bg-surface p-5"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-subtitle">
              Puntuación
              {/* Errores de validacion en rating */}
              {errors.rating && (
                <span className="ml-2 text-sm text-accent">
                  *{errors.rating.message}
                </span>
              )}
            </p>
            {/* Controlador para el rating */}
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={
                        value <= field.value
                          ? "text-2xl text-accent"
                          : "text-2xl text-border-subtle"
                      }
                      aria-label={value + " estrellas"}
                    >
                      ★
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Review */}
          <div>
            <label
              htmlFor="review"
              className="mb-2 block text-sm font-medium text-subtitle"
            >
              Reseña
              {/* Errores de validacion en review */}
              {errors.review && (
                <span className="ml-2 text-sm text-accent">
                  *{errors.review.message}
                </span>
              )}
            </label>
            <textarea
              id="review"
              rows={4}
              className="w-full rounded-lg border border-card-border bg-card px-4 py-2 text-subtitle outline-none transition focus:border-primary focus:shadow-neon-cyan"
              {...register("review")}
            />
          </div>

          {/* Mensaje de error de la API */}
          {apiError && <p className="text-sm text-accent">{apiError}</p>}

          {/* Botones de accion */}
          <div className="flex gap-3">
            {/* Guardar cambios/publicar reseña */}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-fg transition hover:bg-primary-hover disabled:opacity-50"
            >
              {isPending
                ? "Guardando..."
                : editing
                  ? "Guardar cambios"
                  : "Publicar reseña"}
            </button>
            {/* Boton para cancelar edicion */}
            {editing && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="rounded-xl border border-card-border px-4 py-2 text-subtitle"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
