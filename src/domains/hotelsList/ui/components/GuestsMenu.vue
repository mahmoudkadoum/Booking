<script setup lang="ts">
  import { reactive } from 'vue'
  import { useHotelsFacade } from '@/domains/hotelsList/application/useHotelsFacade'

  const menu = ref(false)
  const { guests, resetPagination } = useHotelsFacade()

  const localFilters = reactive({
    adults: guests.value.adults,
    children: guests.value.children,
    rooms: guests.value.rooms,
  })

  function inc (field: keyof typeof localFilters) {
    localFilters[field]++
  }
  function dec (field: keyof typeof localFilters) {
    if (localFilters[field] > 0) localFilters[field]--
  }

  function applyAndClose () {
    guests.value = { ...localFilters }
    resetPagination()
    menu.value = false
  }
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="top"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" color="blue-darken-4" variant="outlined">
        <p class="text-wrap">
          Guests ({{ localFilters.adults }} Adults, {{ localFilters.children }} Children, {{ localFilters.rooms }} Rooms)
        </p>
      </v-btn>
    </template>

    <v-card class="pa-4" min-width="300">
      <!-- Adults -->
      <div class="d-flex justify-space-between align-center mb-2">
        <span>Adults</span>
        <v-btn :disabled="localFilters.adults <= 1" icon="mdi-minus" variant="text" @click="dec('adults')" />
        <span>{{ localFilters.adults }}</span>
        <v-btn icon="mdi-plus" variant="text" @click="inc('adults')" />
      </div>

      <!-- Children -->
      <div class="d-flex justify-space-between align-center mb-2">
        <span>Children</span>
        <v-btn :disabled="localFilters.children <= 0" icon="mdi-minus" variant="text" @click="dec('children')" />
        <span>{{ localFilters.children }}</span>
        <v-btn icon="mdi-plus" variant="text" @click="inc('children')" />
      </div>

      <!-- Rooms -->
      <div class="d-flex justify-space-between align-center mb-2">
        <span>Rooms</span>
        <v-btn :disabled="localFilters.rooms <= 1" icon="mdi-minus" variant="text" @click="dec('rooms')" />
        <span>{{ localFilters.rooms }}</span>
        <v-btn icon="mdi-plus" variant="text" @click="inc('rooms')" />
      </div>

      <v-divider class="my-3" />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="menu = false">Cancel</v-btn>
        <v-btn color="indigo" variant="flat" @click="applyAndClose">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
