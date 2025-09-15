import type { Ref } from 'vue'
import type { Room } from '@/domains/hotelsList/domain/entities/Hotel.ts'
import type { InfiniteScrollDone } from '@/shared/entities/Global.ts'
import { storeToRefs } from 'pinia'
import { useHotelsStore } from '@/domains/hotelsList/application/hotelsStore'

export function useHotelsFacade () {
  const store = useHotelsStore()
  const {
    filtered,
    paged,
    total,
    page,
    pageSize,
    loading,
    priceRange,
    sortBy,
    search,
    city,
    rating,
    amenities,
    showSoldOut,
    dateRange,
    guests,
    totalGuests,
    visible,
    selectedHotelId,
    roomsModalVisible,
  } = storeToRefs(store)

  async function openRoomsModal (id: number) {
    console.log('openRoomsModal', id)
    store.selectedHotelId = id

    await new Promise(resolve => setTimeout(resolve, 800))

    roomsModalVisible.value = true
  }

  function closeRoomsModal () {
    selectedHotelId.value = null
    roomsModalVisible.value = false
  }

  function roomsForSelectedHotel () {
    console.log('roomsForSelectedHotel', selectedHotelId.value)
    if (!selectedHotelId.value) {
      return []
    }
    console.log('roomsByHotelId', store.roomsByHotelId())
    return store.roomsByHotelId()
  }

  async function load (
    { done }: { done: InfiniteScrollDone },
    router: any,
    route: any,
    loadingMore: Ref<boolean>,
  ) {
    loadingMore.value = true

    // if (store.hotels.length === 0) {
    //   console.log('No hotels')
    //   await store.loadAll()
    // }

    console.log('<------------- LOAD MORE HOTELS --------------->')

    await new Promise(resolve => setTimeout(resolve, 800))

    if ((page.value * pageSize.value) < total.value) {
      console.log(page.value)

      store.nextPage()

      router.replace({
        query: {
          ...route.query,
          page: page.value.toString(),
        },
      })

      loadingMore.value = false
      done('ok')
    } else {
      loadingMore.value = false
      done('empty')
    }
  }

  return {
    // state
    filtered,
    paged,
    total,
    page,
    pageSize,
    loading,
    priceRange,
    search,
    sortBy,
    city,
    rating,
    amenities,
    showSoldOut,
    dateRange,
    guests,
    totalGuests,
    visible,
    roomsModalVisible,
    selectedHotelId,

    // actions
    load,
    loadAll: store.loadAll,
    resetPagination: store.resetPagination,
    roomsByHotelId: store.roomsByHotelId,
    openRoomsModal,
    closeRoomsModal,
    roomsForSelectedHotel,
  }
}
