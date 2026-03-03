import { useQRScanner } from "@qr/useQRScanner.ts";
import { Button } from "@/shadcn/ui/button";

export const PageQRGenerator = () => {
  const { start, stop, result, active } = useQRScanner();

  return (
    <>
      {active && (
        <div className="absolute z-50 top-0 left-0 right-0">
          <div className="mx-auto max-w-[1280px] px-4">
            <div className="flex">
              <Button onClick={stop} variant={"secondary"} className="mt-3 cursor-pointer">
                Stop scan
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        {!active && (
          <Button onClick={start} variant={"secondary"} className="mt-3 cursor-pointer">
            Start scan
          </Button>
        )}

        {active && (
          <Button onClick={stop} variant={"secondary"} className="mt-3 cursor-pointer">
            Stop scan
          </Button>
        )}

        {result?.content && (
          <div className="mt-4 p-2 border rounded">
            <p className="font-semibold">Result:</p>
            <pre>{result.content}</pre>
          </div>
        )}
      </div>
    </>
  );
};
