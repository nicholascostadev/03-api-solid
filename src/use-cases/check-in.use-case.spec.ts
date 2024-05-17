import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins.repository'
import { CheckInUseCase } from './check-in.use-case'
import { afterEach } from 'node:test'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms.repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      description: 'Gym 01 description',
      latitude: -22.1880595,
      longitude: -43.753228,
      phone: '123456789',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1880595,
      userLongitude: -43.753228,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in the same day twice', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1880595,
      userLongitude: -43.753228,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.1880595,
        userLongitude: -43.753228,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1880595,
      userLongitude: -43.753228,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1880595,
      userLongitude: -43.753228,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in if the user is too far from the gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Gym 02',
      description: 'Gym 02 description',
      latitude: -22.5238209,
      longitude: -43.7107104,
      phone: '123456789',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.1880595,
        userLongitude: -43.753228,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
