import path from "node:path";
import process from "node:process";
import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
