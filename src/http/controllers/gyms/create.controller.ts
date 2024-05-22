import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '~/use-cases/factories/make-create-gym-use-case'

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CreateGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullish(),
    phone: z.string().nullish(),
    latitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 90
    }),
    longitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    CreateGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
