#!/usr/bin/env node
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const lessonsDir = join(__dirname, "..", "lessons");

const arg = process.argv[2];

if (!arg) {
  console.error("Usage: npm test <lesson-number>   (e.g. npm test 5)");
  process.exit(1);
}

const padded = arg.padStart(2, "0");
const match = readdirSync(lessonsDir).find(
  (f) => f.startsWith(`${padded}-`) && f.endsWith(".ts")
);

if (!match) {
  console.error(`No lesson found matching number "${arg}" in lessons/`);
  process.exit(1);
}

const result = spawnSync("tsx", [join(lessonsDir, match)], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
