"use client";

import { useEffect } from "react";

import { trackViewRegion } from "@/lib/tracking";
import type { RegionKey } from "@/lib/types";

interface RegionViewTrackerProps {
  region: RegionKey;
}

export function RegionViewTracker({ region }: RegionViewTrackerProps) {
  useEffect(() => {
    trackViewRegion(region);
  }, [region]);

  return null;
}

