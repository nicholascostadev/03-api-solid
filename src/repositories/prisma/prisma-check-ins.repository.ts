import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins.repository'
import { db } from '~/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await db.checkIn.create({
      data,
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await db.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async findById(id: string) {
    const checkIn = await db.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await db.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await db.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async save(data: {
    id: string
    validated_at: Date | null
    user_id: string
    gym_id: string
    created_at: Date
  }) {
    const checkIn = await db.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }
}
