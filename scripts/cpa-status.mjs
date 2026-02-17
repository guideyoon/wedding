import { readFile } from "node:fs/promises";
import path from "node:path";

const DATASET_PATH = path.join(process.cwd(), "public", "data", "wedding.json");

function clean(value) {
  return String(value ?? "").trim();
}

async function main() {
  const raw = await readFile(DATASET_PATH, "utf-8");
  const dataset = JSON.parse(raw);

  const regions = dataset.regions ?? [];
  const events = regions.flatMap((region) => region.events ?? []);
  const withCpa = events.filter((event) => clean(event.cpaUrl)).length;
  const missing = events.length - withCpa;

  console.log(`generatedAt: ${dataset.generatedAt}`);
  console.log(`totalEvents: ${events.length}`);
  console.log(`withCpa: ${withCpa}`);
  console.log(`missingCpa: ${missing}`);
  console.log("");
  console.log("missing by region:");

  for (const region of regions) {
    const regionEvents = region.events ?? [];
    const missingCount = regionEvents.filter((event) => !clean(event.cpaUrl)).length;
    console.log(`- ${region.key}: ${missingCount}/${regionEvents.length}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
