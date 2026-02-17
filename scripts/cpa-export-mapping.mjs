import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATASET_PATH = path.join(process.cwd(), "public", "data", "wedding.json");

function parseArgs(argv) {
  const args = { out: "cpa-mapping.tsv" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--out" && argv[i + 1]) {
      args.out = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function cleanCell(value) {
  return String(value ?? "")
    .replace(/\t/g, " ")
    .replace(/\r?\n/g, " ")
    .trim();
}

async function main() {
  const { out } = parseArgs(process.argv.slice(2));
  const raw = await readFile(DATASET_PATH, "utf-8");
  const dataset = JSON.parse(raw);

  const rowsByDetailUrl = new Map();

  for (const region of dataset.regions ?? []) {
    for (const event of region.events ?? []) {
      const detailUrl = cleanCell(event.detailUrl);
      if (!detailUrl) {
        continue;
      }

      const key = detailUrl;
      const current = rowsByDetailUrl.get(key) ?? {
        detailUrl,
        regions: new Set(),
        titles: new Set(),
        dateRanges: new Set(),
        currentCpaUrls: new Set(),
        eventCount: 0,
      };

      current.regions.add(cleanCell(region.key));
      current.titles.add(cleanCell(event.title));
      current.dateRanges.add(cleanCell(event.dateRangeText));
      if (cleanCell(event.cpaUrl)) {
        current.currentCpaUrls.add(cleanCell(event.cpaUrl));
      }
      current.eventCount += 1;
      rowsByDetailUrl.set(key, current);
    }
  }

  const header = [
    "detailUrl",
    "eventCount",
    "regions",
    "sampleTitle",
    "sampleDateRange",
    "currentCpaUrl",
    "newCpaUrl",
  ];

  const body = [...rowsByDetailUrl.values()]
    .sort((a, b) => a.detailUrl.localeCompare(b.detailUrl))
    .map((item) => {
      const regions = [...item.regions].sort().join(", ");
      const sampleTitle = [...item.titles][0] ?? "";
      const sampleDateRange = [...item.dateRanges][0] ?? "";
      const currentCpaUrl = [...item.currentCpaUrls][0] ?? "";

      return [
        cleanCell(item.detailUrl),
        String(item.eventCount),
        cleanCell(regions),
        cleanCell(sampleTitle),
        cleanCell(sampleDateRange),
        cleanCell(currentCpaUrl),
        "",
      ];
    });

  const lines = [header, ...body].map((row) => row.join("\t")).join("\n");
  const outputPath = path.join(process.cwd(), out);

  await writeFile(outputPath, `${lines}\n`, "utf-8");

  console.log(`Exported ${body.length} unique detail URLs to ${out}`);
  console.log("Fill only the `newCpaUrl` column, then run: npm run cpa:apply");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
