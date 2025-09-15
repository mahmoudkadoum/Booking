import { currencySymbols } from '@/core/entities/currency'

export function getCurrencySymbol (code?: string): string {
  if (!code) {
    return '$'
  }
  return (currencySymbols as Record<string, string>)[code] || code
}

export function formatCurrency (
  amount: number,
  code?: string,
  locale = 'en-US',
): string {
  const symbol = getCurrencySymbol(code)

  // format number with Intl.NumberFormat
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `${symbol}${formatter.format(amount)}`
}
