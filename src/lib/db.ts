import { PrismaClient } from "@prisma/client"


// DefiniciÃ³n de singleton para PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Tipo para la instancia de PrismaClient
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// DefiniciÃ³n del objeto global para acceder a la instancia de Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Si no hay una instancia en global, crea una nueva
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// En entorno de desarrollo, se asegura de no crear mÃºltiples instancias en hot-reloading
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Exporta la instancia de Prisma
export default prisma
