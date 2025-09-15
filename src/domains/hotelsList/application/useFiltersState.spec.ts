import { nextTick } from 'vue'
import { useFiltersState } from './useFiltersState'

// mock utils
jest.mock('@/core/utils/date', () => ({
  formatDate: (d: Date) => d.toISOString().slice(0, 10),
  generateDateRange: (start: Date, end: Date) => [start, end],
  sortDates: (dates: Date[]) => [...dates].sort((a, b) => a.getTime() - b.getTime()),
}))

// mock hotelsFacade
const resetPaginationMock = jest.fn()
const ratingRef = { value: [4] }
const amenitiesRef = { value: ['WiFi'] }
const showSoldOutRef = { value: false }
const dateRangeRef = { value: { start: new Date('2025-09-16'), end: new Date('2025-09-18') } }
const priceRangeRef = { value: [200, 500] as [number, number] }

jest.mock('@/domains/hotelsList/application/useHotelsFacade', () => ({
  useHotelsFacade: () => ({
    rating: ratingRef,
    amenities: amenitiesRef,
    showSoldOut: showSoldOutRef,
    dateRange: dateRangeRef,
    priceRange: priceRangeRef,
    resetPagination: resetPaginationMock,
  }),
}))

describe('useFiltersState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ratingRef.value = [4]
    amenitiesRef.value = ['WiFi']
    showSoldOutRef.value = false
    dateRangeRef.value = { start: new Date('2025-09-16'), end: new Date('2025-09-18') }
    priceRangeRef.value = [200, 500]
  })

  it('initializes with facade values', () => {
    const { localFilters } = useFiltersState()

    expect(localFilters.rating).toEqual([4])
    expect(localFilters.amenities).toEqual(['WiFi'])
    expect(localFilters.showSoldOut).toBe(false)
    expect(localFilters.start).toBe('2025-09-16')
    expect(localFilters.end).toBe('2025-09-18')
    expect(localFilters.price).toEqual([200, 500])
  })

  it('syncFilters updates facade refs', async () => {
    const { localFilters, applyAndClose } = useFiltersState()
    const emit = jest.fn()
    const { applyAndClose: applyWithEmit } = useFiltersState('sidebar', emit)

    localFilters.rating = [5]
    localFilters.amenities = ['Pool']
    localFilters.showSoldOut = true
    localFilters.start = '2025-09-20'
    localFilters.end = '2025-09-22'
    localFilters.price = [300, 800]

    applyAndClose()
    await nextTick()

    expect(ratingRef.value).toEqual([5])
    expect(amenitiesRef.value).toEqual(['Pool'])
    expect(showSoldOutRef.value).toBe(true)
    expect(dateRangeRef.value.start.toISOString().slice(0, 10)).toBe('2025-09-20')
    expect(dateRangeRef.value.end.toISOString().slice(0, 10)).toBe('2025-09-22')
    expect(priceRangeRef.value).toEqual([300, 800])
    expect(resetPaginationMock).toHaveBeenCalled()
  })

  it('onReset resets filters to default', () => {
    const { localFilters, onReset } = useFiltersState()
    onReset()

    expect(localFilters.rating).toEqual([])
    expect(localFilters.amenities).toEqual([])
    expect(localFilters.showSoldOut).toBe(true)
    expect(localFilters.start).toBe('')
    expect(localFilters.end).toBe('')
    expect(localFilters.price).toEqual([100, 1000])
    expect(priceRangeRef.value).toEqual([100, 1000])
  })

  it('applyAndClose calls emit("close")', () => {
    const emit = jest.fn()
    const { applyAndClose } = useFiltersState('dialog', emit)

    applyAndClose()
    expect(emit).toHaveBeenCalledWith('close')
  })
})
