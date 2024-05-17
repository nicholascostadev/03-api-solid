import { GymsRepository } from '../gyms.repository'
import { Gym, Prisma } from '@prisma/client'
import crypto from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

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
}
