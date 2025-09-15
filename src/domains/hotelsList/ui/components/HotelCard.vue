<script setup lang="ts">
  import type { Hotel } from '@/domains/hotelsList/domain/entities/Hotel.ts'
  import { formatCurrency } from '@/core/utils/currency'
  import { useHotelsFacade } from '@/domains/hotelsList/application/useHotelsFacade.ts'
  import { AMENITIES } from '@/domains/hotelsList/constants/amenities'

  const props = defineProps<{ hotel: Hotel }>()

  const { hotel } = props

  const hotelsFacade = useHotelsFacade()
</script>

<template>
  <article
    :aria-label="hotel.name"
    class="bg-white elevation-3 rounded mb-3 d-flex flex-column flex-md-row justify-center justify-md-start gap-3 overflow-hidden"
    role="article"
    tabindex="0"
  >
    <v-carousel class="card-carousel" hide-delimiters show-arrows="hover">
      <v-carousel-item v-for="image in hotel.images" :key="image" cover>
        <img alt="hotel image" class="card-image" :src="image">
      </v-carousel-item>
    </v-carousel>

    <div class="flex-grow-1 pa-4 pa-md-8 d-flex flex-column flex-md-row justify-space-between ga-4">
      <div class="flex-grow-1 pr-4 d-flex flex-column justify-space-between">
        <div class="d-flex flex-column">
          <h4 class="font-semibold">{{ hotel.name }}</h4>
          <v-rating
            color="yellow-darken-3"
            density="compact"
            half-increments
            :model-value="hotel.star_rating"
            readonly
            :size="'small'"
          />
          <div class="text-sm text-gray-600">
            <span><v-icon color="grey-darken-1" icon="mdi-map-marker" /></span>
            {{ hotel.address?.city }}, {{ hotel.address?.country }}
          </div>
          <div class="text-sm text-gray-600">
            <span><v-icon color="grey-darken-1" icon="mdi-map-marker-radius-outline" /></span>
            {{ hotel.mockDistance }} KM From {{ hotelsFacade.city }}
          </div>
          <div class="text-sm text-gray-600">
            <span><v-icon color="grey-darken-1" icon="mdi-bed-double-outline" /></span>
            {{ hotel.address?.city }} KM {{ hotel.address?.country }}
          </div>
        </div>

        <div class="w-100 mt-2">
          <div class="d-flex justify-start my-2">
            <p class="text-center text-caption text-blue-grey-lighten-2 font-weight-bold mt-2">
              {{ hotelsFacade.guests.value.adults }} Adults <v-icon icon="mdi-account-multiple" />
              , {{ hotelsFacade.guests.value.children }} Children <v-icon icon="mdi-human-child" />
              , {{ hotelsFacade.guests.value.rooms }} Rooms <v-icon icon="mdi-bed-outline" />
            </p>
          </div>
          <div class="d-flex ga-2 flex-wrap">
            <v-chip
              v-for="amenity in hotel.amenities"
              :key="amenity"
              color="blue-grey-darken-1"
              label
              size="small"
              variant="outlined"
            >
              <v-icon :icon="AMENITIES.find(a => a.value === amenity)?.icon || 'mdi-help-circle-outline'" left />
              {{ amenity }}
            </v-chip>
          </div>
        </div>

      </div>
      <div class="d-flex flex-column justify-space-between align-md-center justify-center text-right">
        <div class="d-flex align-center flex-md-column justify-md-space-between ga-1" style="width: fit-content">
          <p class="text-center text-subtitle-2 text-md-h6 font-weight-bold text-blue-grey-darken-3">Total Price</p>
          <p class="text-center text-subtitle-2 text-md-subtitle-1 text-blue-grey-darken-4">Start From</p>
          <p class="text-center text-subtitle-1 text-md-h5 text-blue-darken-4 font-weight-bold">
            {{ formatCurrency(hotel.lowestBasePrice * hotelsFacade.totalGuests.value, hotel.currency) }}
          </p>
        </div>
        <v-btn
          class="text-none w-100 w-md-auto"
          color="blue-darken-4"
          elevation="1"
          @click="hotelsFacade.openRoomsModal(hotel.id)"
        >
          Show Rooms
        </v-btn>

      </div>
    </div>
  </article>
</template>

<style scoped>
  .card-carousel {
    width: 25%;
    min-width: 25%;
    height: auto !important;
    object-fit: cover;
  }

  .card-carousel .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 960px) {
    .card-carousel {
      width: 100%;
    }
  }
</style>
