import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users.repository'
import { AuthenticateUseCase } from '~/use-cases/authenticate.use-case'
import { InvalidCredentialsError } from '~/use-cases/errors/invalid-credentials-error'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AuthenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = AuthenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
