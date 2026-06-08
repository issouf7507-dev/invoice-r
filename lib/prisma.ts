import { PrismaClient } from "@/app/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
