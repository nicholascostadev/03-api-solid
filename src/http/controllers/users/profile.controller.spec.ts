import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get logged user's profile", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body).toEqual({
      user: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
        created_at: expect.any(String),
      },
    })
  })
})
