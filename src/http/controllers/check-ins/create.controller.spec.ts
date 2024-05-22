import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '~/app'
import { db } from '~/lib/prisma'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await db.gym.create({
      data: {
        title: 'Gym 1',
        latitude: -22.1880595,
        longitude: -43.753228,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.1880595,
        longitude: -43.753228,
      })

    expect(response.statusCode).toEqual(201)
  })
})
