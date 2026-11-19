import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import { inventory, prescriptions } from "../lib/data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.prescription.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.prescription.createMany({ data: prescriptions });
  await prisma.inventoryItem.createMany({ data: inventory });
  console.log(`Seeded ${prescriptions.length} prescriptions, ${inventory.length} medicines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());