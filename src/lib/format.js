const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

export function formatPrice(value) {
    return priceFormatter.format(value);
}