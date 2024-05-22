import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '~/use-cases/factories/make-search-gyms-use-case'

export async function searchController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const SearchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().int().min(1).default(1),
  })

  const { query, page } = SearchGymsQuerySchema.parse(request.query)

  const createGymUseCase = makeSearchGymsUseCase()

  const { gyms } = await createGymUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
