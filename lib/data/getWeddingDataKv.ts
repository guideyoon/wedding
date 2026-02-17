const WEDDING_DATA_KV_BINDING_NAME = "WEDDING_DATA_KV";
export const WEDDING_DATA_KV_KEY = "dataset:v1";

export interface KvNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

function isKvNamespaceLike(value: unknown): value is KvNamespaceLike {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.get === "function" && typeof candidate.put === "function";
}

export async function getWeddingDataKv(): Promise<KvNamespaceLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    const env = (context as unknown as { env?: Record<string, unknown> }).env;
    const binding = env?.[WEDDING_DATA_KV_BINDING_NAME];
    return isKvNamespaceLike(binding) ? binding : null;
  } catch {
    return null;
  }
}
