"use client";

import { useEffect } from "react";
import { sendCapiEvent } from "@/lib/meta-capi";

export default function MetaPixel() {
  useEffect(() => {
    // Send PageView to CAPI on every route change / page load
    sendCapiEvent("PageView");
  }, []);

  return null;
}
