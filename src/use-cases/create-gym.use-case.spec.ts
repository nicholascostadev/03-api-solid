import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms.repository'
import { CreateGymUseCase } from './create-gym.use-case'

let usersRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 01',
      latitude: -22.1880595,
      longitude: -43.753228,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
