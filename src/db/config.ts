import {PrismaClient} from '../generated/client';

const prismaClientSingleton = () => {
  const prisma = new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Menggunakan instance yang sudah ada di globalThis jika tersedia
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Simpan ke globalThis jika bukan di production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;