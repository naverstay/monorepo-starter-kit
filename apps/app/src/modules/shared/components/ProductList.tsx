import type {Product} from "@shared-types/db";
import {ProductItem} from "@modules/shared/components/ProductItem.tsx";

export const ProductList = ({productList}: { productList: Product[] }) => {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {productList.map((product) => (
        <ProductItem key={product.id} product={product}/>
      ))}
    </div>
  );
};
