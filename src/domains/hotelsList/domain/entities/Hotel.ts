export interface Hotel {
  id: number
  name: string
  description: string
  star_rating: number
  review_count: number
  amenities: string[]
  address: {
    street: string
    city: string
    country: string
    postal_code: string
    latitude: number
    longitude: number
  }
  contact: {
    phone: string
    email: string
    website: string
  }
  images: string[]
  rooms: Room[]
  lowestBasePrice: number
  currency: string
  mockDistance: number
}

export interface Room {
  type: string
  max_guests: number
  base_price: number
  currency: string
  availability: Availability[]
}

export interface Availability {
  date: string // ISO format "YYYY-MM-DD"
  available: boolean
  price: number
  currency: string
}

export type SortBy = 'distance' | 'priceAsc' | 'priceDesc' | 'ratingAsc' | 'ratingDesc' | 'nameAsc' | 'nameDesc'
export type City = 'Barcelona' | 'Dubai' | 'London' | 'New York' | 'Paris' | 'Prague' | 'Rome' | 'Singapore' | 'Sydney' | 'Tokyo'
export type DateRange = { end: Date, start: Date }
