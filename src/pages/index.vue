<script lang="ts" setup>
  import { useLayoutStore } from '@/core/layouts/store/layoutStore'

  const layoutStore = useLayoutStore()
</script>

<template>
  <v-row no-gutters>
    <v-col
      class="d-none d-md-flex flex-column elevation-3"
      cols="12"
      md="3"
      style="position: sticky; top: 0; overflow-y: auto; height: calc(100vh - 64px);"
    >
      <Filters type="sidebar" />
    </v-col>

    <!-- Main content -->
    <v-col class="main-content" cols="12" md="9">
      <HotelsList />
    </v-col>
  </v-row>

  <!-- Mobile Modal -->
  <v-dialog
    v-model="layoutStore.showFiltersDialog"
    class="d-md-none"
    fullscreen
  >
    <Filters type="dialog" @close="layoutStore.closeFilters()" />
  </v-dialog>
</template>

<style scoped>
  .main-content {
    height: calc(100vh - 64px);
    background-color: #f5f5f5;
  }
</style>
