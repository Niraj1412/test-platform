import { UserRole } from '@prisma/client'
import { prisma } from '../src/lib/prisma.js'
import { hashPassword } from '../src/utils/hash.js'

const main = async () => {
  const email = 'admin@quizforge.local'
  const passwordHash = await hashPassword('AdminPass123!')
  await prisma.user.upsert({
    where: { email },
    update: {
      name: 'QuizForge Admin',
      role: UserRole.ADMIN,
      isEmailVerified: true
    },
    create: {
      email,
      name: 'QuizForge Admin',
      passwordHash,
      role: UserRole.ADMIN,
      isEmailVerified: true
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error: unknown) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
