import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as mariadb from 'mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  // If we are in the Edge runtime (Cloudflare Workers/Pages)
  if (process.env.NEXT_RUNTIME === 'edge') {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined')
    }

    // Initialize the MariaDB adapter by passing the connection string directly.
    // This allows the adapter to manage the pool internally and solves typing issues.
    const adapter = new PrismaMariaDb(connectionString)
    return new PrismaClient({ adapter })
  }

  // Local development or non-edge environment
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
