import { defineConfig } from '@prisma/config';

// Pastikan variabel lingkungan dari file .env terbaca dengan baik
import 'dotenv/config'; 

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node ./prisma/seed.js',
  },
});