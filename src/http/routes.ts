import { registerController } from './controllers/register.controller'
import { FastifyInstance } from 'fastify'

export async function routes(app: FastifyInstance) {
  app.post('/users', registerController)
}
