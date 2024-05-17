import { authenticateController } from './controllers/authenticate.controller'
import { profileController } from './controllers/profile.controller'
import { registerController } from './controllers/register.controller'
import { FastifyInstance } from 'fastify'
import { verifytJwt } from './middlewares/verify-jwt'

export async function routes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)

  /* Authenticated Routes */
  app.get(
    '/me',
    {
      onRequest: [verifytJwt],
    },
    profileController,
  )
}
