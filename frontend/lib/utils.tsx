export function formatCurrency(amount: number): string | undefined {
  try {
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  } catch (error) {
    return undefined;
  }
}