import dayjs from "dayjs";

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

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("DD MMM, HH:MM") : "Not provided";
};