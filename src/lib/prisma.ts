import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  return new PrismaClient().$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache in ALL environments to prevent connection pool exhaustion
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
