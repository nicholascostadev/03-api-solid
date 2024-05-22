import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '~/app'
import { db } from '~/lib/prisma'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await db.user.findFirstOrThrow()

    const gym = await db.gym.create({
      data: {
        title: 'Gym 1',
        latitude: -22.1880595,
        longitude: -43.753228,
      },
    })

    let checkIn = await db.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(204)
    expect(checkIn.validated_at).toBeNull()

    checkIn = await db.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).not.toBeNull()
  })
})
