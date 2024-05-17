import { FindManyNearbyParams, GymsRepository } from '../gyms.repository'
import { Gym, Prisma } from '@prisma/client'
import crypto from 'node:crypto'
import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async findManyNearby({ userLatitude, userLongitude }: FindManyNearbyParams) {
    return this.items.filter((gym) => {
      const distanceInKilometers = getDistanceBetweenCoordinates(
        {
          latitude: userLatitude,
          longitude: userLongitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distanceInKilometers < 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
}
