"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS } from "@/lib/api";
import { getToken } from "@/lib/auth";

// Iniciar sesión
export async function login(_estadoPrevio, formData) {
  const res = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res)
    return {
      error:
        "No se pudo conectar con la API. Si estaba dormida, prueba de nuevo en unos segundos.",
    };
  if (res.status === 401) return { error: "Usuario o contraseña incorrectos." };
  if (!res.ok)
    return { error: "La API respondió con un error. Intenta de nuevo." };

  // Acceder al token y el usuario
  const { access } = await res.json();
  const username = String(formData.get("username") ?? "");
  const jar = await cookies();

  // Extraer el email del payload del token JWT
  let email = "";
  try {
    const payloadBase64 = access.split(".")[1];

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");

    const payloadDecoded = JSON.parse(atob(base64));

    email = String(payloadDecoded.email ?? "");
  } catch (error) {
    console.error("No se pudo extraer el email del token:", error);
  }

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  };

  // Guardar datos en cookies
  jar.set("access", access, cookieOptions);
  jar.set("username", username, cookieOptions);
  if (email) {
    jar.set("email", email, cookieOptions);
    console.log("Email extraído del token:", email);
  }

  redirect("/");
}

// Cerrar sesión
export async function logout() {
  const jar = await cookies();
  jar.delete("access");
  jar.delete("username");
  redirect("/login");
}

// Registrar usuario
export async function register(_estadoPrevio, formData) {
  const datos = Object.fromEntries(formData.entries());

  const res = await fetch(`${API_URL}/api/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 400) {
    const errorData = await res.json();
    const primerError = Object.values(errorData)[0];
    return {
      error: Array.isArray(primerError)
        ? primerError[0]
        : "Revisa los datos ingresados.",
    };
  }
  if (!res.ok) return { error: "ocurrio un error al registrarse." };

  redirect("/login");
}

// Llamar a la API
async function llamar(path, opciones = {}) {
  const token = await getToken();
  return fetch(`${API_URL}${path}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  }).catch(() => null);
}

// PRODUCTOS

export async function crearProducto(datos) {
  const res = await llamar(ENDPOINTS.products, {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Tu sesión venció. Vuelve a iniciar sesión." };
  if (!res.ok)
    return {
      error:
        "No se pudo guardar. Revisa los datos: la categoría y marca deben existir.",
    };
  revalidatePath("/products");
  return {};
}

export async function editarProducto(id, datos) {
  const res = await llamar(`${ENDPOINTS.products}${id}/`, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Tu sesión venció." };
  if (!res.ok) return { error: "No se pudo editar el producto." };
  revalidatePath("/products");
  return {};
}

export async function borrarProducto(id) {
  const res = await llamar(`${ENDPOINTS.products}${id}/`, { method: "DELETE" });
  if (!res) return { error: "Sin conexión con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Sesión vencida." };
  if (!res.ok && res.status !== 404) return { error: "No se pudo borrar." };
  revalidatePath("/products");
  return {};
}

// Obtener productos (lectura pública)

const PAGE_SIZE = 10; // igual que PAGE_SIZE en settings.py de Django

// Ordena los datos que llegan de Django para usarlos más fácil
function normalizeProduct(raw) {
  const relation = (value) =>
    value && typeof value === "object"
      ? { id: value.id, name: value.name }
      : null;

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    price: Number(raw.price ?? 0),
    image: raw.image ?? null,
    category: relation(raw.category),
    brand: relation(raw.brand),
  };
}

// Obtener una página de productos
export async function getProducts({
  page = 1,
  search = "",
  category = "",
  brand = "",
  ordering = "",
} = {}) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (ordering) params.set("ordering", ordering);
  const query = params.toString();

  // Arma la URL: http://127.0.0.1:8000/api/products/  (+ ?page=2 si hace falta)
  let url = API_URL + ENDPOINTS.products;
  if (query) url = url + "?" + query;

  const res = await fetch(url, { cache: "no-store" }).catch(() => null);

  if (!res) throw new Error("No se pudo conectar con la API.");
  if (res.status === 404) return { count: 0, results: [], totalPages: 0 };
  if (!res.ok)
    throw new Error("La API respondió " + res.status + " al pedir productos.");

  const data = await res.json();
  return {
    count: data.count,
    results: data.results.map(normalizeProduct),
    totalPages: Math.ceil(data.count / PAGE_SIZE),
  };
}

// Buscar el nombre de una categoría o marca por su id
async function getRelation(path, id) {
  const res = await fetch(API_URL + path + id + "/", {
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await res.json();
  return { id: data.id, name: data.name };
}

// Obtener UN producto por su id
export async function getProduct(id) {
  const url = API_URL + ENDPOINTS.products + encodeURIComponent(id) + "/";
  const res = await fetch(url, { cache: "no-store" }).catch(() => null);

  if (!res) throw new Error("No se pudo conectar con la API.");
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(
      "La API respondió " + res.status + " al pedir el producto.",
    );

  const data = await res.json();
  const product = normalizeProduct(data);

  // El detalle de la API trae category y brand solo como números:
  // en ese caso pedimos los nombres a /api/categories/ y /api/brands/
  if (typeof data.category === "number") {
    product.category = await getRelation(ENDPOINTS.categories, data.category);
  }
  if (typeof data.brand === "number") {
    product.brand = await getRelation(ENDPOINTS.brands, data.brand);
  }

  return product;
}

// CARRITO DE COMPRAS

// Obtener carrito activo del usuario
export async function getMyCart() {
  const res = await llamar(ENDPOINTS.carts);
  if (!res || !res.ok) return null;
  const data = await res.json();
  if (Array.isArray(data)) return data[0] || null;
  return data.results?.[0] || null;
}

// Agregar producto al carrito
export async function agregarAlCarrito(productId, cantidad = 1) {
  const res = await llamar(`/api/carts/add-item/`, {
    method: "POST",
    body: JSON.stringify({
      product_id: Number(productId),
      quantity: Number(cantidad),
    }),
  });
  if (!res || !res.ok) {
    return { error: "Error al agregar el producto al carrito." };
  }
  revalidatePath("/shopping-cart");
  return { success: true };
}

// Aumentar cantidad de un cartitem
export async function incrementarItem(cartItemId) {
  const res = await llamar(`/api/cart-items/${cartItemId}/incrementar/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res || !res.ok) {
    return { error: "Error al aumentar la cantidad del producto." };
  }
  revalidatePath("/shopping-cart");
  return { success: true };
}
// Restar cantidad de un cartitem
export async function decrementarItem(cartItemId) {
  const res = await llamar(`/api/cart-items/${cartItemId}/decrementar/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res || !res.ok) {
    return { error: "Error al reducir la cantidad del producto." };
  }
  revalidatePath("/shopping-cart");
  return { success: true };
}

export async function eliminarItem(cartItemId) {
  const res = await llamar(`/api/cart-items/${cartItemId}/delete-item/`, {
    method: "DELETE",
  });
  if (!res || !res.ok) {
    return { error: "Error al eliminar el producto del carrito." };
  }
  revalidatePath("/shopping-cart");
  return { success: true };
}

// Vaciar carrito completo
export async function vaciarCarrito(cartId) {
  const res = await llamar(`${ENDPOINTS.carts}${cartId}/vaciar/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res || !res.ok) {
    return { error: "Error al vaciar el carrito." };
  }
  revalidatePath("/shopping-cart");
  return { success: true };
}
// Iniciar Checkout y obtener preferencia de Mercado Pago
export async function iniciarCheckout() {
  const res = await llamar("/api/checkout/preference/", {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res || !res.ok) {
    return {
      error: "No se pudo generar la preferencia de pago en Mercado Pago.",
    };
  }
  const data = await res.json();
  if (!data?.init_point) {
    return {
      error: "El servidor no retornó el link (init_point) de pago.",
    };
  }
  return { init_point: data.init_point };
}

// ORDENES

// Obtener ordenes
export async function getOrders(status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await llamar(`${ENDPOINTS.orders}${query}`);
  if (!res || !res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

// Obtener una orden por ID
export async function getOrderById(id) {
  const res = await llamar(`${ENDPOINTS.orders}${id}/`);
  if (!res || !res.ok) return null;
  return res.json();
}
// Cancelar una orden pendiente
export async function cancelarOrder(orderId) {
  const res = await llamar(`${ENDPOINTS.orders}${orderId}/cancelar/`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (!res || !res.ok) {
    return { error: "No se pudo cancelar la orden." };
  }

  revalidatePath("/orders");
  return { success: true };
}
// Traer TODAS las páginas de un endpoint público (sin token)
async function fetchAllPublic(path) {
  let url = API_URL + path;
  let all = [];

  while (url) {
    const res = await fetch(url, { cache: "no-store" }).catch(() => null);
    if (!res || !res.ok) return all;

    const data = await res.json();
    if (Array.isArray(data)) return data;

    all = all.concat(data.results ?? []);
    url = data.next;
  }
  return all;
}

// Categorías para el filtro
export async function getCategories() {
  const data = await fetchAllPublic(ENDPOINTS.categories + "?ordering=name");
  return data.map((c) => ({ id: c.id, name: c.name }));
}

// Marcas para el filtro
export async function getBrands() {
  const data = await fetchAllPublic(ENDPOINTS.brands + "?ordering=name");
  return data.map((b) => ({ id: b.id, name: b.name }));
}

// Especificaciones técnicas de un producto
export async function getProductSpecifications(productId) {
  const data = await fetchAllPublic(
    ENDPOINTS.productSpecifications +
      "?product=" +
      encodeURIComponent(productId),
  );
  return data.map((item) => ({
    id: item.id,
    name: item.specification ? item.specification.name : "",
    value: item.value,
  }));
}

// Rating promedio de un producto (null si no tiene reseñas)
export async function getProductRating(productId) {
  const url =
    API_URL +
    ENDPOINTS.productRatings +
    "?product=" +
    encodeURIComponent(productId);
  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return null;

  const data = await res.json();
  const rating = data.results ? data.results[0] : null;
  if (!rating || rating.total_reviews === 0) return null;

  return { average: rating.average_rating, total: rating.total_reviews };
}

// Normalizar una reseña
function normalizarReview(raw) {
  return {
    id: raw.id,
    user: raw.user ?? "",
    rating: Number(raw.rating),
    review: raw.review ?? "",
    created: raw.created,
  };
}

// Refrescar el rating de un producto
async function refrescarRating(productId) {
  const rating = await getProductRating(productId);
  revalidatePath(`/products/${productId}`);
  return rating;
}

// Obtener todas las reseñas de un producto ordenadas por fecha
export async function getReviews(productId) {
  const data = await fetchAllPublic(
    ENDPOINTS.reviews +
      "?product=" +
      encodeURIComponent(productId) +
      "&ordering=-created",
  );
  return data.map(normalizarReview);
}

// Agregar una review
export async function crearReview(productId, { rating, review }) {
  const res = await llamar(ENDPOINTS.reviews, {
    method: "POST",
    body: JSON.stringify({
      product: Number(productId),
      rating: Number(rating),
      review,
    }),
  });
  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Tu sesión venció. Vuelve a iniciar sesión." };
  if (!res.ok) return { error: "No se pudo publicar la reseña." };
  await refrescarRating(productId);
  return { success: true };
}

// Editar una review
export async function editarReview(reviewId, productId, { rating, review }) {
  const res = await llamar(`${ENDPOINTS.reviews}${reviewId}/`, {
    method: "PATCH",
    body: JSON.stringify({ rating: Number(rating), review }),
  });
  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Tu sesión venció. Vuelve a iniciar sesión." };
  if (!res.ok) return { error: "No se pudo editar la reseña." };
  await refrescarRating(productId);
  return { success: true };
}

// Eliminar una review
export async function borrarReview(reviewId, productId) {
  const res = await llamar(`${ENDPOINTS.reviews}${reviewId}/`, {
    method: "DELETE",
  });
  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403)
    return { error: "Tu sesión venció. Vuelve a iniciar sesión." };
  if (!res.ok && res.status !== 404)
    return { error: "No se pudo borrar la reseña." };
  await refrescarRating(productId);
  return { success: true };
}
