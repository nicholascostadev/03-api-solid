import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms.repository'
import { SearchGymsUseCase } from './search-gyms.use-case'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      latitude: -22.1880595,
      longitude: -43.753228,
    })
    await gymsRepository.create({
      title: 'Gym 2',
      latitude: -22.1880595,
      longitude: -43.753228,
    })

    const { gyms } = await sut.execute({
      query: '1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        latitude: -22.1880595,
        longitude: -43.753228,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
