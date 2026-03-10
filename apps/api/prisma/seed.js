require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Coca-Cola 0.5L",
    brand: "Coca-Cola",
    barcode: "5449000000996",
    energy: 180,
    fat: 0,
    fat_saturated: 0,
    carbs: 42,
    sugars: 42,
    protein: 0,
    salt: 0.01,
    fiber: null,
  },
  {
    name: "Sprite 0.5L",
    brand: "Coca-Cola",
    barcode: "5449000133323",
    energy: 144,
    fat: 0,
    fat_saturated: 0,
    carbs: 36,
    sugars: 36,
    protein: 0,
    salt: 0.01,
    fiber: null,
  },
  {
    name: "Lay's Classic 150g",
    brand: "Lay's",
    barcode: "4014400900016",
    energy: 2255,
    fat: 34,
    fat_saturated: 4.5,
    carbs: 53,
    sugars: 3,
    protein: 6,
    salt: 1.5,
    fiber: 4.5,
  },
  {
    name: "Nutella 350g",
    brand: "Ferrero",
    barcode: "8000500162000",
    energy: 2252,
    fat: 30.9,
    fat_saturated: 10.6,
    carbs: 57.5,
    sugars: 56.3,
    protein: 6.3,
    salt: 0.107,
    fiber: null,
  },
  {
    name: "Milk 2.5% 1L",
    brand: "Prostokvashino",
    barcode: "4601234567890",
    energy: 210,
    fat: 2.5,
    fat_saturated: 1.6,
    carbs: 4.7,
    sugars: 4.7,
    protein: 2.8,
    salt: 0.1,
    fiber: null,
  },
  {
    name: "Mellenu zefirs",
    brand: "Laima",
    barcode: "4750011848646",
    energy: 1255,
    fat: 0,
    fat_saturated: 0,
    carbs: 78,
    sugars: 65,
    protein: 4.5,
    salt: 0.02,
    fiber: null,
  },
];
async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
