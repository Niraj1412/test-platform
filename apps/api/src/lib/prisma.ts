import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

function makePrisma() {
  if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter, log: ['error'] })
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? makePrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
