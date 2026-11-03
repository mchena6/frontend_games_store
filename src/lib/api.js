import { getToken } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const ENDPOINTS = {
  products: "/api/products/",
  categories: "/api/categories/",
  brands: "/api/brands/",
  productSpecifications: "/api/product-specifications/",
  productRatings: "api/product-ratings/",
  carts: "/api/carts/",
  orders: "/api/orders/",
  users: "/api/users/",
  wishlist: "/api/wishlist/",
};

export async function list(path, queryParams = "") {
  const token = await getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let page = 1;
  let all = [];

  // para que la URL soporte queryparams
  const Query = queryParams.startsWith("?")
    ? queryParams + "&"
    : queryParams
      ? `?${queryParams}&`
      : "?";

  while (true) {
    const res = await fetch(`${API_URL}${path}${Query}page=${page}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`La API respondio ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

export async function getOne(path, id) {
  const token = await getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}${path}${id}/`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error al obtener ${id}`);
  return res.json();
}
