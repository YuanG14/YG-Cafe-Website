/** Formats a number as Philippine peso, e.g. formatCurrency(286) -> "₱286.00". */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}
