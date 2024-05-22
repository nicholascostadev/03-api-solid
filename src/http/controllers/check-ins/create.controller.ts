import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '~/use-cases/factories/make-check-in-use-case'

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CreateCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const CreateCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 90
    }),
    longitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 180
    }),
  })

  const { gymId } = CreateCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = CreateCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
