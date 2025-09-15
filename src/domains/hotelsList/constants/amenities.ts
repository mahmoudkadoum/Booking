export interface AmenityOption {
  value: string
  icon: string
}

export const AMENITIES: AmenityOption[] = [
  { value: 'Pool', icon: 'mdi-pool' },
  { value: 'Restaurant', icon: 'mdi-silverware-fork-knife' },
  { value: 'Room service', icon: 'mdi-room-service' },
  { value: 'Airport shuttle', icon: 'mdi-airplane' },
  { value: 'Pet friendly', icon: 'mdi-dog' },
  { value: 'EV charging', icon: 'mdi-ev-station' },
  { value: 'Parking', icon: 'mdi-parking' },
  { value: 'Free WiFi', icon: 'mdi-wifi' },
  { value: 'Breakfast included', icon: 'mdi-coffee' },
  { value: 'Business center', icon: 'mdi-briefcase' },
  { value: '24h front desk', icon: 'mdi-account-clock' },
  { value: 'Laundry', icon: 'mdi-washing-machine' },
  { value: 'Bar', icon: 'mdi-glass-wine' },
  { value: 'Gym', icon: 'mdi-dumbbell' },
  { value: 'Spa', icon: 'mdi-spa' },
]
