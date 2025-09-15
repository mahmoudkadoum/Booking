<script setup lang="ts">
  import type { Hotel } from '@/domains/hotelsList/domain/entities/Hotel.ts'
  import { formatCurrency } from '@/core/utils/currency.ts'
  import { useHotelsFacade } from '@/domains/hotelsList/application/useHotelsFacade.ts'

  const hotelsFacade = useHotelsFacade()

  function book () {
    console.log('Booking functionality to be implemented.')
  }

  function close () {
    hotelsFacade.closeRoomsModal()
  }
</script>

<template>
  <v-dialog v-model="hotelsFacade.roomsModalVisible.value" class="rooms-modal">
    <v-card class="pa-4 px-2 pa-md-8 px-md-4">
      <v-card-title>
        <p class="text-h6 font-weight-bold text-blue-grey-darken-3 text-wrap">
          {{ hotelsFacade.selectedHotelId.value
            ? hotelsFacade.visible.value.find((hotel: Hotel) => hotel.id === hotelsFacade.selectedHotelId.value)?.name : '' }}
          Rooms
        </p>
      </v-card-title>

      <div class="d-flex flex-column px-2 px-md-4 ga-2 mt-1 mt-md-4">
        <article
          v-for="room in hotelsFacade.roomsForSelectedHotel()"
          :key="room.type"
          :aria-label="room.type"
          class="bg-white elevation-3 rounded mb-3 d-flex flex-column flex-md-row justify-center justify-md-start gap-3 overflow-hidden"
          role="article"
          tabindex="0"
        >
          <div class="flex-grow-1 pa-4 pa-md-8 d-flex flex-column flex-md-row justify-space-between ga-4">
            <div class="flex-grow-1 pr-4 d-flex flex-column justify-space-between">
              <div class="d-flex flex-column">
                <h4 class="font-semibold">{{ room.type }}</h4>
                <div class="text-sm text-gray-600">
                  <span><v-icon color="grey-darken-1" icon="mdi-account-multiple-outline" /></span>
                  Capacity {{ room.max_guests }}
                </div>
                <div v-if="room.availableInDateRange" class="text-sm text-green-darken-4 mt-2">
                  <v-chip color="green">
                    Available
                  </v-chip>
                </div>
                <div v-if="!room.availableInDateRange" class="text-sm text-red-darken-4 mt-2">
                  <v-chip color="red">
                    Not available
                  </v-chip>
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
              </div>

            </div>
            <div class="d-flex flex-column justify-space-between align-md-center justify-center text-right">
              <div class="d-flex align-center flex-md-column justify-md-space-between ga-1" style="width: fit-content">
                <p class="text-center text-subtitle-2 text-md-h6 font-weight-bold text-blue-grey-darken-3">Total Price</p>
                <p class="text-center text-subtitle-2 text-md-subtitle-1 text-blue-grey-darken-4">Start From</p>
                <p class="text-center text-subtitle-1 text-md-h5 text-blue-darken-4 font-weight-bold">
                  {{ formatCurrency(room.base_price * hotelsFacade.totalGuests.value, room.currency) }}
                </p>
              </div>
              <v-btn
                class="text-none w-100 bg-blue-darken-4 text-white"
                :disabled="!room.availableInDateRange"
                elevation="2"
                @click="book()"
              >
                Book
              </v-btn>
            </div>
          </div>
        </article>
      </div>

      <v-card-actions>
        <v-btn color="primary" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .rooms-modal{
    width: 75vw;
    max-height: 80vh;
    overflow-y: auto;
  }

  @media (max-width: 960px) {
    .rooms-modal{
      width: 90vw;
      max-height: 90vh;
    }
  }
</style>
