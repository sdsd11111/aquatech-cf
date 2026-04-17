import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as mariadb from 'mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Usar siempre el Adapter de MariaDB porque eliminamos el motor pesado de Prisma
  // para poder cumplir con el límite de 3MB de Cloudflare Free Tier.
  const adapter = new PrismaMariaDb(connectionString)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
