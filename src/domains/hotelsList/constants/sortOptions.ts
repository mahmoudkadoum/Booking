export interface SortOption {
  label: string
  value: string
}

export const SORTOPTIONS: SortOption[] = [
  { label: 'Distance', value: 'distance' },
  { label: 'Rating (Lowest First)', value: 'ratingAsc' },
  { label: 'Rating (Highest First)', value: 'ratingDesc' },
  { label: 'Price (Lowest First)', value: 'priceAsc' },
  { label: 'Price (Highest First)', value: 'priceDesc' },
  { label: 'Name Ascending', value: 'nameAsc' },
  { label: 'Name Descending', value: 'nameDesc' },
]
