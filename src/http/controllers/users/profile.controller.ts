import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserProfileUseCase } from '~/use-cases/factories/make-get-user-profile-use-case'

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  const userDto = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  }

  return reply.status(200).send({ user: userDto })
}
