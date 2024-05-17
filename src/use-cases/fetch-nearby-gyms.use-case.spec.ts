import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms.repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.use-case'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -22.1880595,
      longitude: -43.753228,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -22.5238209,
      longitude: -43.7107104,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.1880595,
      userLongitude: -43.753228,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
