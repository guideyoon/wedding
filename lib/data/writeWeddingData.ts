import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { WeddingDataset } from "@/lib/types";

const DATA_DIRECTORY_PATH = path.join(process.cwd(), "public", "data");
const DATA_FILE_PATH = path.join(DATA_DIRECTORY_PATH, "wedding.json");

export async function writeWeddingData(dataset: WeddingDataset): Promise<void> {
  await mkdir(DATA_DIRECTORY_PATH, { recursive: true });
  await writeFile(DATA_FILE_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf-8");
}

