<script setup lang="ts">
  import type { InfiniteScrollDone } from '@/shared/entities/Global.ts'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { CITYOPTIONS } from '@/domains/hotelsList/constants/cityOptions.ts'
  import { SORTOPTIONS } from '@/domains/hotelsList/constants/sortOptions.ts'
  import { useHotelsFacade } from '../../application/useHotelsFacade.ts'
  import HotelCard from './HotelCard.vue'

  const hotelsFacade = useHotelsFacade()
  const router = useRouter()
  const route = useRoute()

  const loadingMore = ref(false)

  const lastDone = ref<null | (InfiniteScrollDone)>(null)

  const sortOptions = SORTOPTIONS
  const citiesOptions = CITYOPTIONS

  onMounted(async () => {
    const pageFromUrl = Number(route.query.page || 1)

    if (hotelsFacade.filtered.value.length === 0) {
      await hotelsFacade.loadAll()
    }

    const stop = watch(
      () => hotelsFacade.visible.value.length,
      async len => {
        console.log(len)
        if (pageFromUrl > 1 && len >= pageFromUrl * hotelsFacade.pageSize.value) {
          await nextTick()

          console.log(pageFromUrl)
          hotelsFacade.page.value = pageFromUrl

          const card = document.querySelector(`[data-page="${pageFromUrl}"]`)
          console.log(card)
          if (card) {
            requestAnimationFrame(() => {
              card.scrollIntoView({ behavior: 'smooth' })
            })
          }

          stop() // stop watcher after scroll once
        } else if (pageFromUrl === 1 && len > 0) {
          stop()
        }
      },
      { immediate: true },
    )
  })

  function load ({ done }: { done: InfiniteScrollDone }) {
    if (loadingMore.value) return
    loadingMore.value = true
    lastDone.value = done
    hotelsFacade.load({ done }, router, route, loadingMore)
  }

  watch(() => hotelsFacade.page.value, (newPage, oldPage) => {
    if (newPage === 1 && oldPage !== 1 && lastDone.value) {
      lastDone.value('ok')
    }
  })

  // Scroll to top function
  function scrollToTop () {
    const card = document.querySelector(`[data-page="1"]`)
    if (card) {
      card?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    hotelsFacade.page.value = 1
  }
</script>

<template>
  <div class="hotel-list">
    <!-- Search -->
    <div class="my-4 ">
      <div class="my-4 d-flex items-center justify-between flex-column">
        <div v-if="hotelsFacade.filtered.value?.length > 0">
          <p class="text-h6 text-blue-grey-darken-2 font-weight-medium">
            {{ hotelsFacade.city }} Showing {{ hotelsFacade.filtered.value.length }} {{ hotelsFacade.filtered.value.length > 1 ? 'Hotels' : 'Hotel' }}
          </p>
        </div>
      </div>
      <div
        class="bg-grey-lighten-4 elevation-6  rounded pa-md-3 px-4 px-md-6 pb-md-6 w-100"
      >
        <v-row class="mt-4">
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="hotelsFacade.sortBy.value"
              clearable
              density="comfortable"
              item-title="label"
              item-value="value"
              :items="sortOptions"
              label="Sort by"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="hotelsFacade.city.value"
              clearable
              density="comfortable"
              item-title="value"
              item-value="value"
              :items="citiesOptions"
              label="City"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="hotelsFacade.search.value"
              density="comfortable"
              label="Search"
              placeholder="Search hotels by name..."
              variant="outlined"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Infinite scroll -->
    <v-infinite-scroll
      v-if="hotelsFacade.visible.value.length > 0"
      :items="hotelsFacade.visible.value"
      @load="load"
    >
      <v-row dense>
        <template v-for="(hotel, index) in hotelsFacade.visible.value" :key="hotel.id">
          <v-col cols="12" md="12" sm="6">
            <HotelCard
              :data-page="Math.floor(index / hotelsFacade.pageSize.value) + 1"
              :hotel="hotel"
              transition="scroll-x-transition"
            />
          </v-col>
        </template>
      </v-row>

      <!-- Skeleton loader while loading -->
      <template #loading>
        <v-row v-if="loadingMore" class="w-100" dense>
          <template v-for="num in 4" :key="num">
            <v-col cols="12" md="12" sm="6">
              <v-skeleton-loader :skeleton-num="num" type="card" />
            </v-col>
          </template>
        </v-row>
      </template>
    </v-infinite-scroll>

    <v-row v-if="hotelsFacade.visible.value.length === 0 && hotelsFacade.loading.value" class="w-100" dense>
      <template v-for="num in 4" :key="num">
        <v-col cols="12" md="12" sm="6">
          <v-skeleton-loader :skeleton-num="num" type="card" />
        </v-col>
      </template>
    </v-row>

    <RoomsModal />

    <div v-if="!hotelsFacade.loading.value && hotelsFacade.total.value === 0" class="mt-4">
      No results found.
    </div>

    <!-- Floating scroll-to-top button -->
    <button
      v-if="hotelsFacade.visible.value.length > 4"
      class="scroll-top-btn"
      @click="scrollToTop"
    >
      <v-icon color="white" icon="mdi-arrow-up-thin" />
    </button>
  </div>
</template>

<style scoped>
.hotel-list {
  height: 100%;
  max-height: 100%;
  overflow-y: visible;
}

/* Floating circular button */
.scroll-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #0D47A1;
  border-radius: 50%;
  border: none;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px 0 #0D47A1;
  cursor: pointer;
  transition: all 0.2s;
}

.scroll-top-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 12px 2px #0D47A1;
}
</style>
