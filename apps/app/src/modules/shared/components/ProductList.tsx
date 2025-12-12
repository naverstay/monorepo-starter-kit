import {Card, CardContent, CardHeader} from "@/shadcn/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/shadcn/custom/avatar";
import type {Product} from "@shared-types/db";

export const ProductList = ({productList}: { productList: Product[] }) => {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {productList.map((product) => (
        <Card key={product.id} className="shadow-sm border">
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
        </Card>
      ))}
    </div>
  );
};
