import {useRef, useState} from "react";
import {Card, CardContent, CardHeader} from "@/shadcn/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/shadcn/custom/avatar";
import {QRGenerator} from "@qr/QRGenerator.tsx";
import type {Product} from "@shared-types/db";
import {useElementPosition} from "@modules/shared/hooks/useElementPosition.ts";
import {useInsideOutsideClick} from "@modules/shared/hooks/useInsideOutsideClick.ts";
import {cn} from "@/lib/utils";

export const ProductItem = ({product}: { product: Product }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const position = useElementPosition(ref);
  const [showQr, setShowQr] = useState<boolean>(false);

  useInsideOutsideClick(
    ref,
    () => setShowQr(true),
    () => setShowQr(false),
    () => {
      // setShowQr(false)
    }
  );

  return (
    <Card ref={ref} className="shadow-sm border relative">
      <CardHeader className="flex items-center gap-4">
        <Avatar sizeClassName={"size-10"}>
          <AvatarImage src={product.image_url ?? ""} alt={product.name_ru}/>
          <AvatarFallback>{product.name_ru?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{product.name_ru}</h3>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold">{product.name_de}</h3>
        <h3 className="text-lg font-semibold">{product.name_en}</h3>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">ГИ {product.g_index}</span>
          <span className="text-sm text-muted-foreground">ГН {product.g_load}</span>
        </div>
      </CardContent>

      <div
        className={cn("absolute z-1 p-1 will-change-[transform] transition-[top,transform] duration-500 left-1/2 -translate-x-1/2 pointer-events-none",
          (showQr ? "" : "hidden"),
          (position === "top" ? "top-0 -translate-y-[100%]" : "top-full translate-y-0")
        )}>
        <div className={"bg-card rounded-xl shadow-sm border mx-auto flex justify-center"}>
          <QRGenerator value={product.id}/>
        </div>
      </div>
    </Card>
  );
};
