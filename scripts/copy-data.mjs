import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(projectRoot, "data");
const targetDir = path.join(projectRoot, "public", "data");

async function main() {
  console.log("Copying data files for React app...");
  console.log(`From: ${sourceDir}`);
  console.log(`To:   ${targetDir}`);

  await mkdir(path.dirname(targetDir), { recursive: true });

  // Remove old copied data so deleted files do not linger.
  await rm(targetDir, { recursive: true, force: true });

  // Copy all current data files.
  await cp(sourceDir, targetDir, { recursive: true });

  console.log("Data copy complete.");
}

main().catch((error) => {
  console.error("Failed to copy data files:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});