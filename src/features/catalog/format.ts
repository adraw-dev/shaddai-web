/** Formato de precios en pesos colombianos, sin decimales: «$ 29.000». */
const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export const formatCop = (amount: number) => cop.format(amount);
