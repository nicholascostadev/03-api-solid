import { authenticateController } from './authenticate.controller'
import { profileController } from './profile.controller'
import { registerController } from './register.controller'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { refreshController } from './refresh.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)

  app.patch('/token/refresh', refreshController)

  /* Authenticated Routes */
  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    profileController,
  )
}
