<script setup lang="ts">
  import { ref } from 'vue'
  import { VDateInput } from 'vuetify/labs/VDateInput'
  import { getTomorrowStr } from '@/core/utils/date'
  import { useFiltersState } from '@/domains/hotelsList/application/useFiltersState'
  import { useHotelsFacade } from '@/domains/hotelsList/application/useHotelsFacade'
  import { AMENITIES } from '@/domains/hotelsList/constants/amenities.ts'
  import useQuerySync from '@/shared/composables/useQuerySync'
  import GuestsMenu from './GuestsMenu.vue'

  const props = defineProps<{ type?: 'sidebar' | 'dialog' }>()
  const emit = defineEmits(['close'])

  const { model, localFilters, onReset, applyAndClose, syncPrice } = useFiltersState(props.type, emit)

  const { rating, amenities, showSoldOut, dateRange, guests } = useHotelsFacade()

  useQuerySync(
    {
      rating,
      amenities,
      showSoldOut,
      guests,
      dateRange,
    },
    ['page', 'city', 'showSoldOut',
     'adults', 'children', 'rooms',
     'start', 'end',
     'rating', 'amenities', 'price'],
  )

  const facilityOptions = AMENITIES
  const panel = ref([0, 1, 2, 3])
  const tomorrowStr = getTomorrowStr()
</script>

<template>
  <v-card class="filtersSidebar" rounded="0">
    <!-- Toolbar -->
    <v-toolbar
      class="toolbar"
      color="white"
      elevation="1"
      height="84"
      rounded="0"
    >
      <template #title>
        <div class="d-flex justify-space-between align-center w-100">
          <p class="text-h5 font-weight-bold text-blue-darken-4">Filters</p>
          <v-btn
            class="me-5"
            color="blue-darken-4"
            variant="outlined"
            @click="onReset"
          >
            Reset
          </v-btn>
        </div>
      </template>

      <!-- Close button (only for mobile modal) -->
      <v-btn
        class="d-md-none"
        icon="mdi-close"
        variant="text"
        @click="$emit('close')"
      />
    </v-toolbar>

    <v-sheet class="filtersSidebarContent">
      <v-expansion-panels
        v-model="panel"
        class="w-100 rounded-0"
        elevation="0"
        multiple
        rounded="0"
        variant="accordion"
      >
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default>
              <h3 class="text-h6 font-weight-bold">Facilities</h3>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-chip-group
              v-model="localFilters.amenities"
              column
              multiple
              selected-class="text-primary"
            >
              <v-chip
                v-for="option in facilityOptions"
                :key="option.value"
                color="green"
                label
                size="small"
                :value="option.value"
                variant="outlined"
              >
                <v-icon :icon="option.icon" left />
                {{ option.value }}
              </v-chip>
            </v-chip-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title v-slot="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start align-center" cols="2">
                <h3 class="text-h6 font-weight-bold">Date</h3>
              </v-col>
              <v-col
                class="d-flex align-center"
                cols="10"
              >
                <v-fade-transition leave-absolute>
                  <span v-if="expanded" class="ms-3 text-caption text-wrap">When do you want to travel?</span>
                  <v-row
                    v-else
                    no-gutters
                    style="width: 100%"
                  >
                    <v-col class="d-flex justify-start text-blue-grey-lighten-2 text-body-1" cols="6">
                      Start date: {{ localFilters.start || 'Not set' }}
                    </v-col>
                    <v-col class="d-flex justify-start text-blue-grey-lighten-2 text-body-1" cols="6">
                      End date: {{ localFilters.end || 'Not set' }}
                    </v-col>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VDateInput
              v-model="model"
              class="pb-2"
              label="Select range"
              :min="tomorrowStr"
              multiple="range"
              prepend-icon=""
              variant="solo"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default>
              <h3 class="text-h6 font-weight-bold">Budget</h3>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-range-slider
              v-model="localFilters.price"
              class="pt-4"
              color="blue-darken-4"
              :max="2500"
              :min="100"
              step="10"
              thumb-label="always"
              @end="syncPrice"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default>
              <h3 class="text-h6 font-weight-bold">Rating</h3>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex flex-column-reverse ga-2">
              <div v-for="star in 5" :key="star" class="d-flex align-center">
                <v-checkbox v-model="localFilters.rating" :value="star" />
                <v-rating
                  color="yellow-darken-3"
                  density="compact"
                  half-increments
                  hide-details
                  :length="star"
                  :model-value="star"
                  readonly
                  size="small"
                />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default>
              <h3 class="text-h6 font-weight-bold">Guests</h3>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <GuestsMenu />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default>
              <h3 class="text-h6 font-weight-bold">Availability</h3>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-switch
              v-model="localFilters.showSoldOut"
              color="blue-darken-4"
              label="Show Sold Out"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>

      <!-- Mobile Apply Button -->
      <div v-if="type === 'dialog'" class="d-md-none mt-4 pa-4">
        <v-btn
          block
          color="blue-darken-4"
          @click="applyAndClose"
        >
          Apply
        </v-btn>
      </div>
    </v-sheet>
  </v-card>
</template>

<style scoped>
.filtersSidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.filtersSidebar > div {
  height: 100%;
  box-shadow: inset -15px 0 10px -20px black !important;
}

.filtersSidebar .toolbar {
  box-shadow: inset -15px 0 10px -20px black !important;
  border-bottom: 1px solid lightgray;
}
.filtersSidebarContent {
  overflow-y: auto;
  max-height: 100%;
  padding-right: 4px;
  padding-bottom: 16px;
}
@media (max-width: 768px) {
  .filtersSidebar {
    width: 100%;
    height: auto;
  }
}
</style>
