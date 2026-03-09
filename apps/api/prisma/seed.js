require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  { name: 'Coca-Cola 0.5L', brand: 'Coca-Cola', barcode: '5449000000996' },
  { name: 'Sprite 0.5L', brand: 'Coca-Cola', barcode: '5449000133323' },
  { name: "Lay's Classic 150g", brand: "Lay's", barcode: '4014400900016' },
  { name: 'Nutella 350g', brand: 'Ferrero', barcode: '8000500162000' },
  { name: 'Milk 2.5% 1L', brand: 'Prostokvashino', barcode: '4601234567890' },
  { name: 'Mellenu zefirs', brand: 'Laima', barcode: '4750011848646' },
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
