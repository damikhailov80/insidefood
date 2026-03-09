require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Coca-Cola 0.5L',
        brand: 'Coca-Cola',
        barcode: '5449000000996',
      },
      {
        name: 'Sprite 0.5L',
        brand: 'Coca-Cola',
        barcode: '5449000133323',
      },
      {
        name: "Lay's Classic 150g",
        brand: "Lay's",
        barcode: '4014400900016',
      },
      {
        name: 'Nutella 350g',
        brand: 'Ferrero',
        barcode: '8000500162000',
      },
      {
        name: 'Milk 2.5% 1L',
        brand: 'Prostokvashino',
        barcode: '4601234567890',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Test products inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
