import { defineConfig } from "@prisma/config";
import * as dotenv from 'dotenv';

dotenv.config(); // load .env sebelum export config

export default defineConfig({
  migrations: {
    seed: `ts-node prisma/seed.ts`,
  },
});