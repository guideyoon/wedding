import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getWeddingDataKv, WEDDING_DATA_KV_KEY } from "@/lib/data/getWeddingDataKv";
import type { WeddingDataset } from "@/lib/types";

const DATA_DIRECTORY_PATH = path.join(process.cwd(), "public", "data");
const DATA_FILE_PATH = path.join(DATA_DIRECTORY_PATH, "wedding.json");

export type WeddingDataStorage = "kv" | "file";

export async function writeWeddingData(dataset: WeddingDataset): Promise<WeddingDataStorage> {
  const payload = `${JSON.stringify(dataset, null, 2)}\n`;
  let kvError: unknown = null;

  const kv = await getWeddingDataKv();
  if (kv) {
    try {
      await kv.put(WEDDING_DATA_KV_KEY, payload);
      return "kv";
    } catch (error) {
      kvError = error;
    }
  }

  try {
    await mkdir(DATA_DIRECTORY_PATH, { recursive: true });
    await writeFile(DATA_FILE_PATH, payload, "utf-8");
    return "file";
  } catch (fileError) {
    if (kvError) {
      throw new Error("Failed to persist wedding data to KV and file storage.");
    }
    throw fileError;
  }
}

