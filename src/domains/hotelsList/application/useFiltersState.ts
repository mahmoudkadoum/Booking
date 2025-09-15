import { reactive, shallowRef, watch } from 'vue'
import { formatDate, generateDateRange, sortDates } from '@/core/utils/date'
import { useHotelsFacade } from '@/domains/hotelsList/application/useHotelsFacade'

export function useFiltersState (type?: 'sidebar' | 'dialog', emit?: (event: 'close') => void) {
  const { rating, amenities, showSoldOut, dateRange, priceRange, resetPagination } = useHotelsFacade()

  // model for v-date-input
  const model = shallowRef<Date[] | null>(
    dateRange.value.start && dateRange.value.end
      ? generateDateRange(dateRange.value.start, dateRange.value.end)
      : null,
  )

  const localFilters = reactive({
    rating: [...rating.value],
    amenities: [...amenities.value],
    showSoldOut: showSoldOut.value,
    start: dateRange.value.start ? formatDate(dateRange.value.start) : '',
    end: dateRange.value.end ? formatDate(dateRange.value.end) : '',
    price: [...priceRange.value] as [number, number], // use facade reactive priceRange
  })

  // Watch date input → update localFilters
  watch(model, newDates => {
    if (Array.isArray(newDates) && newDates.length > 1) {
      const sortedDates = sortDates(newDates)
      localFilters.start = sortedDates[0] ? formatDate(sortedDates[0]) : ''
      localFilters.end = sortedDates.at(-1) ? formatDate(sortedDates.at(-1)!) : ''
    } else {
      localFilters.start = ''
      localFilters.end = ''
    }
  })
  // Watch date input → update localFilters
  watch(priceRange, () => {
    console.log('priceRange', priceRange)
  })

  // Sync all filters except price (reactive)
  function syncFilters () {
    rating.value = [...localFilters.rating]
    amenities.value = [...localFilters.amenities]
    showSoldOut.value = localFilters.showSoldOut
    dateRange.value.start = new Date(localFilters.start)
    dateRange.value.end = new Date(localFilters.end)
    resetPagination()
  }

  // Sync price manually after sliding finishes
  function syncPrice () {
    console.log('priceRange')
    console.log(localFilters.price)
    priceRange.value = [...localFilters.price] as [number, number]
    resetPagination()
  }

  if (type !== 'dialog') {
    // Watch filters except price
    watch(
      () => ({
        rating: localFilters.rating,
        amenities: localFilters.amenities,
        showSoldOut: localFilters.showSoldOut,
        start: localFilters.start,
        end: localFilters.end,
      }),
      syncFilters,
      { deep: true },
    )
  }

  function onReset () {
    localFilters.rating = []
    localFilters.amenities = []
    localFilters.showSoldOut = true
    localFilters.start = ''
    localFilters.end = ''
    localFilters.price = [100, 1000]
    syncPrice()
  }

  function applyAndClose () {
    syncFilters()
    syncPrice()
    emit?.('close')
  }

  return {
    model,
    localFilters,
    onReset,
    applyAndClose,
    syncPrice,
  }
}
