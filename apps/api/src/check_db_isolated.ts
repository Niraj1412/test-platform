import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const creatorId = '75e734a2-4f0b-478b-9690-cbf4ac77a7e6'
  const query = ''
  const type = undefined
  const tag = undefined

  const parsedType = Object.values(QuestionType).find((item) => item === type)
  const list = await prisma.questionBank.findMany({
    where: {
      creatorId,
      type: parsedType,
      tags: tag ? { has: tag } : undefined,
      body: query ? { contains: query, mode: 'insensitive' } : undefined
    },
    orderBy: { createdAt: 'desc' }
  })
  console.log("Result:", list)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
