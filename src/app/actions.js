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

  // Guardar el token en cookies
  const { access } = await res.json();
  (await cookies()).set("access", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  redirect("/")
}

// Cerrar sesión
export async function logout() {
  (await cookies()).delete("access");
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

// CARRITO DE COMPRAS

// Obtener carrito activo del usuario
export async function getMyCart() {
  const res = await llamar(ENDPOINTS.carts);
  if (!res || !res.ok) return null;
  const data = await res.json();
  if (Array.isArray(data)) return data[0] || null;
  return data.results?.[0] || null;
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
