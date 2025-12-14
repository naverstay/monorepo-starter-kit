import { useState } from "react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import type { QRScannerResult } from "./types";

export function useQRScanner() {
  const [result, setResult] = useState<QRScannerResult | null>(null);
  const [active, setActive] = useState(false);

  async function start() {
    await BarcodeScanner.checkPermission({ force: true });

    document.body.classList.add("scanner-active");
    setActive(true);

    const data = await BarcodeScanner.startScan();

    document.body.classList.remove("scanner-active");
    setActive(false);

    if (data.hasContent) {
      setResult({ content: data.content, raw: data });
    }
  }

  function stop() {
    BarcodeScanner.stopScan();
    document.body.classList.remove("scanner-active");
    setActive(false);
  }

  return { start, stop, result, active };
}
