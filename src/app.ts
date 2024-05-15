import { fastify } from 'fastify'
import { z } from 'zod'
import { db } from './lib/prisma'

export const app = fastify()

app.post('/users', async (request, reply) => {
  const RegisterBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = RegisterBodySchema.parse(request.body)

  await db.user.create({
    data: {
      name,
      email,
      password_hash: password, // TODO: hash password
    },
  })

  return reply.status(201).send()
})
