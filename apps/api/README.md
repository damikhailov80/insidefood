## Prisma in `apps/api`

### Key files

- **Schema**: `prisma/schema.prisma`
- **Config**: `prisma.config.ts` (reads `DATABASE_URL` from `.env`)
- **Migrations**: `prisma/migrations`
- **Generated client package**: `@prisma/client`
- **Seed with test data**: `prisma/seed.js`

### Local PostgreSQL connection

1. Make sure PostgreSQL is running locally and the `insidefood` database exists.
2. In `.env` inside `apps/api` check the connection string:

```env
DATABASE_URL="postgresql://dmikhailov@localhost:5432/insidefood"
```

Update user / database / port as needed for your local setup.

### Schema and migrations

- **Change table structure** — edit models in `prisma/schema.prisma`, for example:

```prisma
model Product {
  id      Int    @id @default(autoincrement())
  name    String
  brand   String
  barcode String @unique

  @@map("products")
}
```

- **Apply changes to the database (create/update tables)**:

```bash
cd apps/api
npx prisma migrate dev --name <migration_name>
```

### Prisma Client generation

After changing the schema or running migrations:

```bash
cd apps/api
npx prisma generate
```

The client will be available via the `@prisma/client` package.

### Test data (seed)

To populate the `products` table with test data, use `prisma/seed.js`.

Run the seed:

```bash
cd apps/api
node prisma/seed.js
```

The seed script inserts several products (Coca-Cola, Sprite, Lay’s, etc.) into the `products` table. If records with the same unique `barcode` already exist, they are skipped.

### Prisma Studio (DB UI)

For a simple web UI to view and edit data in your database, run:

```bash
cd apps/api
npx prisma studio
```

This will open Prisma Studio in your browser, where you can inspect and modify records in tables such as `products`.

