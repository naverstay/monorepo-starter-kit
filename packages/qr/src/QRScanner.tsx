import { useQRScanner } from "./useQRScanner";

export function QRScanner() {
  const { start, stop, result, active } = useQRScanner();

  return (
    <div className="p-4 space-y-4">
      {!active && (
        <button onClick={start} className="px-4 py-2 bg-blue-600 text-white rounded">
          Start scan
        </button>
      )}

      {active && (
        <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">
          Stop scan
        </button>
      )}

      {result?.content && (
        <div className="mt-4 p-2 border rounded">
          <p className="font-semibold">Result:</p>
          <pre>{result.content}</pre>
        </div>
      )}
    </div>
  );
}
