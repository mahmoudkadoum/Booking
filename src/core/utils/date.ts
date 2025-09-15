export function generateDateRange (start: Date, end: Date): Date[] {
  const dates: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export function getTomorrowStr (): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

export function formatDate (date: Date | string | null): string {
  if (!date) {
    return ''
  }
  return new Date(date).toISOString().split('T')[0]
}

export function sortDates (dates: (Date | string)[]): Date[] {
  return [...dates]
    .map(d => new Date(d))
    .sort((a, b) => +a - +b)
}
