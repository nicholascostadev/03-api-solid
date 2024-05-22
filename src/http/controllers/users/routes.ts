import { authenticateController } from './authenticate.controller'
import { profileController } from './profile.controller'
import { registerController } from './register.controller'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)

  /* Authenticated Routes */
  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    profileController,
  )
}
