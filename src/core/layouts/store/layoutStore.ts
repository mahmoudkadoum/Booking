import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // mobile layout modal state
  const showFiltersDialog = ref(false)

  // actions
  const openFilters = () => {
    showFiltersDialog.value = true
  }

  const closeFilters = () => {
    showFiltersDialog.value = false
  }

  const toggleFilters = () => {
    showFiltersDialog.value = !showFiltersDialog.value
  }

  return {
    showFiltersDialog,
    openFilters,
    closeFilters,
    toggleFilters,
  }
})
