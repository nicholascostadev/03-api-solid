import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users.repository'
import { UserAlreadyExistsError } from '~/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '~/use-cases/register.use-case'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const RegisterBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = RegisterBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
