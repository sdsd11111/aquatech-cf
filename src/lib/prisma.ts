import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import mariadb from 'mariadb'

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

    // Configure the MariaDB pool without SSL to bypass the certificate issues
    const pool = mariadb.createPool({
      connectionString: connectionString,
      ssl: false, // <-- KEY: Skip SSL verification
      connectTimeout: 20000,
      waitForConnections: true,
      connectionLimit: 10
    })

    const adapter = new PrismaMariaDb(pool)
    return new PrismaClient({ adapter })
  }

  // Local development or non-edge environment
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
