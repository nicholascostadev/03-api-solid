import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 1',
        description: 'Gym 1 description',
        phone: '123456789',
        latitude: -22.1880595,
        longitude: -43.753228,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 2',
        description: 'Gym 2 description',
        phone: '123456789',
        latitude: -22.1880595,
        longitude: -43.753228,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: '2',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 2',
      }),
    ])
  })
})
