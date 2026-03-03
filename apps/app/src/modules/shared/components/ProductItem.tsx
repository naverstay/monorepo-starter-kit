import React, {useRef, useState} from "react";
import {Card, CardContent, CardHeader} from "@/shadcn/custom/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/shadcn/custom/avatar";
import {QRGenerator} from "@qr/QRGenerator";
import type {Product} from "@shared-types/db";
import {useElementPosition} from "@modules/shared/hooks/useElementPosition";
import {cn} from "@/lib/utils";
import {Checkbox} from "@/shadcn/ui/checkbox";
import {useInsideOutsideClick} from "@modules/shared/hooks/useInsideOutsideClick";
import {useCheckStore} from "@/store/nutrition";

export const ProductItem = React.memo((props: {
  product: Product,
  className?: string,
  short?: boolean,
}) => {
  const {product, short, className} = props;
  const ref = useRef<HTMLAnchorElement | null>(null);
  const position = useElementPosition(ref);
  const [showQr, setShowQr] = useState<boolean>(false);

  const checked = useCheckStore((s) => s.checked[product.id]);
  const toggle = useCheckStore((s) => s.toggle);

  useInsideOutsideClick(
    ref,
    (e) => {
      if (e?.target?.tagName?.toLowerCase() !== 'button') {
        e.preventDefault()
        setShowQr(true)
      }
    },
    (e) => {
      e.preventDefault()
      setShowQr(false)
    },
    () => {
      // setShowQr(false)
    }
  );

  return (
    <Card ref={ref}
      // as="a" href={'products/' + product.id}
          className={cn("shadow-sm border relative", className)}>
      {short ? null : <CardHeader className="flex items-center gap-4">
        <Avatar sizeClassName={"size-10"}>
          <AvatarImage src={product.image_url ?? ""} alt={product.name_ru}/>
          <AvatarFallback>{product.name_ru?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{product.name_ru}</h3>
        </div>
      </CardHeader>}
      <CardContent className="text-sm text-muted-foreground">
        {short ?
          <h3 title={product.name_de + " # " + product.name_en}
              className="text-lg font-semibold">
            <Checkbox
              checked={!!checked}
              onCheckedChange={() => toggle(product.id)}
              className="mr-2 relative z-1"
            />
            <span>{product.name_ru}</span>
          </h3> :
          <>
            <h3 className="text-lg font-semibold">{product.name_de}</h3>
            <h3 className="text-lg font-semibold">{product.name_en}</h3>
          </>
        }

        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground"><span>ГИ</span> <b>{product.g_index}</b></span>
          <span className="text-sm text-muted-foreground"><span>ГН</span> <b>{product.g_load}</b></span>
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
});
