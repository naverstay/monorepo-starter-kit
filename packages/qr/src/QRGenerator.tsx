import { QRCodeSVG } from "qrcode.react";

export function QRGenerator({ value, size = 256 }: { value: string; size?: number }) {
  return (
    <div className="flex justify-center items-center p-4">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}
