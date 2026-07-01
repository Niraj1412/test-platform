import { prisma } from '../lib/prisma.js'

export class AdminService {
  async listUsers(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count()
    ])
    return { users, total }
  }

  async listTests(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [tests, total] = await prisma.$transaction([
      prisma.test.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          totalMarks: true,
          accessCode: true,
          createdAt: true,
          updatedAt: true,
          creator: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.test.count()
    ])
    return { tests, total }
  }

  async archiveTest(id: string) {
    return prisma.test.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      select: { id: true, status: true }
    })
  }
}

export const adminService = new AdminService()
