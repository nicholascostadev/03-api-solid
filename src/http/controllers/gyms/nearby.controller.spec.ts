import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        latitude: -22.1880595,
        longitude: -43.753228,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        latitude: -22.5238209,
        longitude: -43.7107104,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.1880595,
        longitude: -43.753228,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
