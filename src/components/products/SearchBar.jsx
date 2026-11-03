"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function handleSubmit(event) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const term = value.trim();
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? "/products?" + query : "/products");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full gap-2 sm:max-w-md">
      <label htmlFor="product-search" className="sr-only">
        Buscar productos
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos, marcas, categorías..."
        className="flex-1 rounded-lg border border-card-border bg-surface px-4 py-2 text-subtitle placeholder:text-muted outline-none transition focus:border-primary focus:shadow-neon-cyan"
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-fg transition hover:bg-primary-hover"
      >
        Buscar
      </button>
    </form>
  );
}