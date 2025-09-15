export type CurrencyCode = 'EUR' | 'USD' | 'JPY' | 'AUD' | 'GBP' | 'CZK' | 'SGD'

export const currencySymbols: Record<CurrencyCode, string> = {
  EUR: '€',
  USD: '$',
  JPY: '¥',
  AUD: '$',
  GBP: '£',
  CZK: 'Kč ',
  SGD: 'S$ ',
}
