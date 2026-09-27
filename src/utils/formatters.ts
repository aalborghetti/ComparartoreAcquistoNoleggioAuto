/**
 * Formatta un numero come valuta Euro (€)
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0 €';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formatta un numero come percentuale (%)
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formatta i chilometri con separatore di migliaia
 */
export function formatKm(value: number): string {
  if (isNaN(value)) return '0 km';
  return `${new Intl.NumberFormat('it-IT').format(Math.round(value))} km`;
}

/**
 * Formatta costo al chilometro (€/km)
 */
export function formatCostPerKm(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0,00 €/km';
  return `${new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value)} €/km`;
}
