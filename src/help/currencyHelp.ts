export const formatCurrencyBRL = (value: number | string): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numberValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

export const parseCurrencyBRL = (value: string): number => {
  if (!value) return 0;

  const numericValue = value.replace(/[R$\s.]/g, '').replace(',', '.');

  const parsedNumber = parseFloat(numericValue);

  return isNaN(parsedNumber) ? 0 : parsedNumber;
};
