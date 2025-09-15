<script setup lang="ts">
  import { useLayoutStore } from '@/core/layouts/store/layoutStore'
  import HotelsListContent from './components/HotelsListContent.vue'

  const layoutStore = useLayoutStore()
</script>

<template>
  <v-layout class="h-100">
    <v-main class="bg-grey-lighten-4 overflow-y-auto">
      <v-toolbar class="bg-transparent pa-4 pa-md-8 pb-0 pb-md-0 hotels-tool-bar">
        <template #title>
          <h2 class="text-h4 font-weight-bold text-blue-grey-darken-3">Hotels</h2>
        </template>

        <!-- Mobile Filters Button -->
        <v-btn
          class="d-md-none"
          color="blue-darken-4"
          icon="mdi-filter"
          variant="text"
          @click="layoutStore.openFilters()"
        />
      </v-toolbar>

      <div class="px-4 px-md-8">
        <v-sheet class="bg-transparent" rounded="sm" width="100%">
          <div class="d-flex flex-column flex-md-row justify-center align-center ga-4">
            <div class="flex-grow-1 pt-0 h-100 w-100">
              <section class="col-span-12 md:col-span-6 w-100">
                <HotelsListContent />
              </section>
            </div>
          </div>
        </v-sheet>
      </div>
    </v-main>
  </v-layout>
</template>
