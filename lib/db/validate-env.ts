const POSTGRES_PREFIXES = ["postgresql://", "postgres://"];

export function assertPostgresDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Add a PostgreSQL connection string to .env — see README.md for Neon setup."
    );
  }

  if (POSTGRES_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return;
  }

  if (url.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL is set to a SQLite path (file:./dev.db), but this project uses PostgreSQL. " +
        "Create a free database at https://neon.tech, copy the pooled URL to DATABASE_URL and the direct URL to DIRECT_URL in .env, then run: npm run db:migrate && npm run db:seed"
    );
  }

  throw new Error(
    "DATABASE_URL must start with postgresql:// or postgres://. Check your .env file."
  );
}
