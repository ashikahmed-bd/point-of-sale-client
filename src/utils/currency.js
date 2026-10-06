export const currency = (amount, code = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}
