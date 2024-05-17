import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users.repository'
import crypto from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)

    return user ?? null
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    return user ?? null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
