import { toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useQuerySync (store: any, syncKeys: string[]) {
  const router = useRouter()
  const route = useRoute()

  // --- parsing function (URL → state) ---
  const parseQueryParam = (key: string, rawValue: any) => {
    if (rawValue == null) {
      return null
    }

    if (['amenities', 'rating', 'priceRange'].includes(key)) {
      return Array.isArray(rawValue)
        ? rawValue
        : String(rawValue).split(',').filter(Boolean)
    }

    if (['adults', 'children', 'rooms'].includes(key)) {
      const numericValue = Number(rawValue)
      return Number.isNaN(numericValue) ? null : numericValue
    }

    if (key === 'showSoldOut') {
      return rawValue ? '1' : '0'
    }

    if (['start', 'end'].includes(key)) {
      return rawValue ? new Date(String(rawValue)) : null
    }

    return rawValue
  }

  // --- INIT: set store from URL on first mount ---
  const queryParams = route.query
  for (const key of syncKeys) {
    if (queryParams[key] !== undefined) {
      const parsedValue = parseQueryParam(key, queryParams[key])

      if (key === 'rating') {
        store.rating.value = parsedValue
        continue
      }

      if (['start', 'end'].includes(key)) {
        store.dateRange.value = {
          ...store.dateRange.value,
          [key]: parsedValue,
        }
        continue
      }

      if (['adults', 'children', 'rooms'].includes(key)) {
        store.guests.value = {
          ...store.guests.value,
          [key]: parsedValue,
        }
        continue
      }

      if (store[key] && typeof store[key] === 'object' && 'value' in store[key]) {
        store[key].value = parsedValue
      } else {
        store[key] = parsedValue
      }
    }
  }

  // --- WATCH: sync store → URL ---
  watch(
    () =>
      syncKeys.map(key => {
        if (key === 'rating') {
          return toRaw(store.rating.value)
        }
        if (['adults', 'children', 'rooms'].includes(key)) {
          return toRaw(store.guests.value[key])
        }
        if (['start', 'end'].includes(key)) {
          return toRaw(store.dateRange.value?.[key])
        }

        const value = store[key]
        if (value && typeof value === 'object' && 'value' in value) {
          return toRaw(value.value)
        }
        return toRaw(value)
      }),
    updatedValues => {
      const nextQuery: Record<string, any> = { ...route.query }

      for (const [index, key] of syncKeys.entries()) {
        const newValue = updatedValues[index]

        if (
          newValue == null
          || newValue === ''
          || (Array.isArray(newValue) && newValue.length === 0 && key !== 'price')
        ) {
          delete nextQuery[key]
          continue
        }

        if (key === 'amenities' && Array.isArray(newValue)) {
          nextQuery[key] = newValue.join(',')
          continue
        }

        if (key === 'rating' && Array.isArray(newValue)) {
          nextQuery[key] = newValue.join(',')
          continue
        }

        if (key === 'price' && Array.isArray(newValue)) {
          nextQuery[key] = newValue.join(',')
          continue
        }

        if (typeof newValue === 'boolean') {
          nextQuery[key] = newValue ? '1' : '0'
          continue
        }

        if (newValue instanceof Date && !Number.isNaN(newValue.getTime())) {
          nextQuery[key] = newValue.toISOString().split('T')[0]
          continue
        }

        nextQuery[key] = String(newValue)
      }

      router.replace({ query: nextQuery })
    },
    { deep: true },
  )
}
