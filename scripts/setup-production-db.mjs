# Production database setup (run after Neon is connected to Vercel)
#
# 1. Accept Neon marketplace terms (one-time):
#    https://vercel.com/photographyamyd-pngs-projects/~/integrations/accept-terms/neon?source=cli
#
# 2. Provision Neon and auto-inject DATABASE_URL:
#    npx vercel integration add neon --plan free_v3 -m region=iad1 -m auth=false -n agency-db -e production -e preview
#
# 3. Pull env vars locally and push schema to Neon:
#    npx vercel env pull .env.production.local --environment=production --yes
#    node scripts/setup-production-db.mjs
#
# 4. Redeploy:
#    npx vercel deploy --prod --yes

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const envFile = ".env.production.local";
if (!existsSync(envFile)) {
  console.error(
    `Missing ${envFile}. Run: npx vercel env pull ${envFile} --environment=production --yes`,
  );
  process.exit(1);
}

function parseEnv(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = parseEnv(readFileSync(envFile, "utf8"));
if (!env.DATABASE_URL) {
  console.error("DATABASE_URL missing from pulled Vercel env. Connect Neon first.");
  process.exit(1);
}

const runEnv = {
  ...process.env,
  DATABASE_URL: env.DATABASE_URL,
  DIRECT_URL: env.DIRECT_URL || env.DATABASE_URL,
};

console.log("Pushing Prisma schema to Neon...");
execSync("npx prisma db push", { stdio: "inherit", env: runEnv });

console.log("Seeding production database...");
execSync("npm run db:seed", { stdio: "inherit", env: runEnv });

console.log("Done. Redeploy with: npx vercel deploy --prod --yes");
