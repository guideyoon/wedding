import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATASET_PATH = path.join(process.cwd(), "public", "data", "wedding.json");

function parseArgs(argv) {
  const args = { in: "cpa-mapping.tsv" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if ((token === "--in" || token === "--file") && argv[i + 1]) {
      args.in = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function clean(value) {
  return String(value ?? "").trim();
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function countEvents(dataset) {
  return (dataset.regions ?? []).reduce((sum, region) => sum + (region.events ?? []).length, 0);
}

async function main() {
  const { in: inputFile } = parseArgs(process.argv.slice(2));
  const mappingPath = path.join(process.cwd(), inputFile);

  const [mappingRaw, datasetRaw] = await Promise.all([
    readFile(mappingPath, "utf-8"),
    readFile(DATASET_PATH, "utf-8"),
  ]);

  const lines = mappingRaw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("Mapping file is empty. Run `npm run cpa:export` first.");
  }

  const header = lines[0].split("\t");
  const detailUrlIndex = header.indexOf("detailUrl");
  const cpaIndexCandidates = ["newCpaUrl", "cpaUrl"];
  const cpaIndex = cpaIndexCandidates.map((name) => header.indexOf(name)).find((idx) => idx >= 0) ?? -1;

  if (detailUrlIndex < 0 || cpaIndex < 0) {
    throw new Error("Header must include `detailUrl` and `newCpaUrl` (or `cpaUrl`).");
  }

  const detailToCpa = new Map();
  const invalidRows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const row = lines[i].split("\t");
    const detailUrl = clean(row[detailUrlIndex]);
    const cpaUrl = clean(row[cpaIndex]);
    if (!detailUrl || !cpaUrl) {
      continue;
    }
    if (!isValidHttpUrl(cpaUrl)) {
      invalidRows.push({ line: i + 1, cpaUrl });
      continue;
    }
    detailToCpa.set(detailUrl, cpaUrl);
  }

  if (invalidRows.length > 0) {
    const sample = invalidRows
      .slice(0, 10)
      .map((row) => `line ${row.line}: ${row.cpaUrl}`)
      .join("\n");
    throw new Error(`Invalid CPA URL found:\n${sample}`);
  }

  const dataset = JSON.parse(datasetRaw);
  let updatedEvents = 0;
  let matchedEvents = 0;

  for (const region of dataset.regions ?? []) {
    for (const event of region.events ?? []) {
      const detailUrl = clean(event.detailUrl);
      const mapped = detailToCpa.get(detailUrl);
      if (!mapped) {
        continue;
      }
      matchedEvents += 1;
      if (event.cpaUrl !== mapped) {
        event.cpaUrl = mapped;
        updatedEvents += 1;
      }
    }
  }

  dataset.generatedAt = new Date().toISOString();
  await writeFile(DATASET_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf-8");

  const totalEvents = countEvents(dataset);
  const withCpa = (dataset.regions ?? [])
    .flatMap((region) => region.events ?? [])
    .filter((event) => clean(event.cpaUrl)).length;

  console.log(`Applied ${detailToCpa.size} detailUrl mappings from ${inputFile}`);
  console.log(`Matched events: ${matchedEvents} / ${totalEvents}`);
  console.log(`Updated events: ${updatedEvents}`);
  console.log(`CPA filled: ${withCpa} / ${totalEvents}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
