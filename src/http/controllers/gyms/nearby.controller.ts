import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '~/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearbyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const NearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 90
    }),
    longitude: z.coerce.number().refine((val) => {
      return Math.abs(val) <= 180
    }),
  })

  const { latitude, longitude } = NearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
