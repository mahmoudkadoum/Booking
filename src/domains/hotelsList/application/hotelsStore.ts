import type { Availability, City, DateRange, Hotel, Room, SortBy } from '../domain/entities/Hotel'
import { defineStore } from 'pinia'
import { HotelsRepositoryInMemory } from '../infrastructure/repositories/HotelsRepositoryInMemory'

const repo = new HotelsRepositoryInMemory()

export const useHotelsStore = defineStore('hotels', {
  state: () => ({
    hotels: [] as Hotel[],
    loading: false,

    // pagination
    page: 1,
    pageSize: 10,

    // filters
    search: '' as string,
    sortBy: 'distance' as SortBy,
    city: 'Sydney' as City,
    rating: [] as number[],
    priceRange: [100, 2000] as [number, number],
    amenities: [] as string[],
    showSoldOut: false,
    dateRange: ((): DateRange => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const endDate = new Date()
      endDate.setDate(tomorrow.getDate() + 2)

      return { start: tomorrow, end: endDate }
    })(),
    guests: { adults: 2, children: 0, rooms: 1 },
    roomsModalVisible: false,
    selectedHotelId: null as number | null,
  }),

  getters: {
    filtered (state): Hotel[] {
      let filteredHotels: Hotel[] = [...state.hotels]

      // search
      if (state.search) {
        const query = state.search.toLowerCase()
        filteredHotels = filteredHotels.filter((hotel: Hotel) =>
          hotel.name.toLowerCase().includes(query),
        )
      }

      // city
      if (state.city) {
        filteredHotels = filteredHotels.filter(
          (hotel: Hotel) => hotel.address?.city === state.city,
        )
      }

      // price filter
      if (state.priceRange && state.priceRange.length === 2) {
        const [minPrice, maxPrice] = state.priceRange
        filteredHotels = filteredHotels.filter((hotel: Hotel) => {
          return hotel.rooms.some((room: Room) => {
            return room.base_price * this.totalGuests >= minPrice && room.base_price * this.totalGuests <= maxPrice
          })
        })
      }

      // rating
      if (state.rating?.length > 0) {
        filteredHotels = filteredHotels.filter((hotel: Hotel) => {
          return state.rating.includes(Math.floor(hotel.star_rating))
        },
        )
      }

      // amenities
      if (state.amenities.length > 0) {
        filteredHotels = filteredHotels.filter((hotel: Hotel) =>
          state.amenities.every((amenity: string) => hotel.amenities.includes(amenity)),
        )
      }

      // date range filter
      if (state.dateRange.start && state.dateRange.end && !state.showSoldOut) {
        const startDate = new Date(state.dateRange.start).setHours(0, 0, 0, 0)
        const endDate = new Date(state.dateRange.end).setHours(0, 0, 0, 0)

        filteredHotels = filteredHotels.filter((hotel: Hotel) => {
          return hotel.rooms.some((room: Room) => {
            if (!room.availability || room.availability.length === 0) {
              return false
            }

            let currentDate = startDate
            while (currentDate <= endDate) {
              const availableThatDay = room.availability.some((day: Availability) => {
                const dayDate = new Date(day.date).setHours(0, 0, 0, 0)
                return dayDate === currentDate && day.available
              })

              if (!availableThatDay) {
                return false
              }
              currentDate += 24 * 60 * 60 * 1000
            }

            return true
          })
        })
      }

      // console.log(filteredHotels)
      // guests filter (rooms available)
      filteredHotels = filteredHotels.filter((hotel: Hotel) => {
        // console.log('----------------------------------------------------------------')
        // console.log('<----------------------' + hotel.name + '---------------------->')
        // console.log('----------------------------------------------------------------')
        const availableRooms = hotel.rooms.filter(room =>
          room.availability?.some((day: Availability) => day.available),
        )
        const totalAllowedGuests = availableRooms
          .sort((a, b) => b.max_guests - a.max_guests) // sort descending
          .slice(0, state.guests.rooms) // take rooms number
          .reduce((sum, room) => sum + room.max_guests, 0)

        // console.log('availableRooms')
        // console.log(availableRooms)
        // console.log('Total Allowed Guests For:' + state.guests.rooms + ' Rooms')
        // console.log(totalAllowedGuests)
        // console.log('Total Guests')
        // console.log(this.totalGuests)
        // console.log(availableRooms.length >= state.guests.rooms && totalAllowedGuests >= this.totalGuests)
        return state.showSoldOut
          ? true
          : availableRooms.length >= state.guests.rooms && totalAllowedGuests >= this.totalGuests
      })
      // console.log(filteredHotels)

      // sorting
      switch (state.sortBy) {
        case 'priceAsc': {
          filteredHotels.sort((hotelA, hotelB) => {
            const lowestPriceA = Math.min(...hotelA.rooms.map((room: Room) => room.base_price))
            const lowestPriceB = Math.min(...hotelB.rooms.map((room: Room) => room.base_price))
            return lowestPriceA - lowestPriceB
          })
          break
        }

        case 'priceDesc': {
          filteredHotels.sort((hotelA, hotelB) => {
            const highestPriceA = Math.min(...hotelA.rooms.map(room => room.base_price))
            const highestPriceB = Math.min(...hotelB.rooms.map(room => room.base_price))
            return highestPriceB - highestPriceA
          })
          break
        }

        case 'ratingAsc': {
          filteredHotels.sort((hotelA, hotelB) => hotelA.star_rating - hotelB.star_rating)
          break
        }

        case 'ratingDesc': {
          filteredHotels.sort((hotelA, hotelB) => hotelB.star_rating - hotelA.star_rating)
          break
        }

        case 'nameAsc': {
          filteredHotels.sort((hotelA, hotelB) => hotelA.name.localeCompare(hotelB.name))
          break
        }

        case 'nameDesc': {
          filteredHotels.sort((hotelA, hotelB) => hotelB.name.localeCompare(hotelA.name))
          break
        }

        default: {
          filteredHotels.sort((hotelA, hotelB) => (hotelA.mockDistance ?? 0) - (hotelB.mockDistance ?? 0))
          break
        }
      }

      return filteredHotels
    },

    visible (state): Hotel[] {
      const endIndex = state.page * state.pageSize
      return this.filtered.slice(0, endIndex)
    },

    total (): number {
      return this.filtered.length
    },

    totalGuests (): number {
      return this.guests.adults + this.guests.children
    },

    paged (): Hotel[] {
      const startIndex = (this.page - 1) * this.pageSize
      return this.filtered.slice(startIndex, startIndex + this.pageSize)
    },
  },

  actions: {
    async loadAll () {
      this.loading = true
      this.hotels = await repo.getAllHotels()
      this.loading = false
    },

    nextPage () {
      if ((this.page * this.pageSize) < this.total) {
        this.page++
      }
    },

    resetPagination () {
      this.page = 1
    },

    roomsByHotelId (): (Room & { availableInDateRange: boolean })[] {
      const selectedHotel = this.hotels.find((hotel: Hotel) => hotel.id === this.selectedHotelId)
      if (!selectedHotel) {
        return []
      }
      console.log(selectedHotel)

      const startDate = new Date(this.dateRange.start).setHours(0, 0, 0, 0)
      const endDate = new Date(this.dateRange.end).setHours(0, 0, 0, 0)

      return selectedHotel.rooms.map((room: Room) => {
        let availableInDateRange = true

        if (!room.availability || room.availability.length === 0) {
          availableInDateRange = false
        } else {
          let currentDate = startDate
          while (currentDate <= endDate) {
            const availableThatDay = room.availability.some((day: Availability) => {
              const dayDate = new Date(day.date).setHours(0, 0, 0, 0)
              return dayDate === currentDate && day.available
            })

            if (!availableThatDay) {
              availableInDateRange = false
              break
            }
            currentDate += 24 * 60 * 60 * 1000
          }
        }

        return {
          ...room,
          availableInDateRange,
        }
      })
    },

  },
})
