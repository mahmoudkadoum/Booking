import type { Hotel, Room } from '../../domain/entities/Hotel'
import raw from '@/data/hotels.json'

export class HotelsRepositoryInMemory {
  private readonly data: any[]

  constructor () {
    this.data = (raw as any[]).map(hotel => this.normalize(hotel))
  }

  async getAllHotels (): Promise<Hotel[]> {
    // simulate small delay
    await new Promise(r => setTimeout(r, 800))
    return this.data
  }

  private normalize (hotel: Hotel): Hotel {
    const amenities = Array.from(new Set(hotel.amenities || []))
    const rooms = (hotel.rooms || []).map((room: Room) => ({ ...room }))
    const lowestBase = rooms.length > 0 ? Math.min(...rooms.map((room: Room) => room.base_price)) : 0
    const mockDistance = Number(((Math.random() * 5) + 1).toFixed(2))

    return {
      id: hotel.id,
      name: hotel.name,
      description: hotel.description,
      star_rating: hotel.star_rating,
      review_count: hotel.review_count,
      amenities,
      address: hotel.address,
      contact: hotel.contact,
      images: hotel.images || [],
      rooms,
      currency: rooms.length > 0 ? rooms[0].currency : 'USD',
      lowestBasePrice: lowestBase,
      mockDistance,
    }
  }
}
