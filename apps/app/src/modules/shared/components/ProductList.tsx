import React from "react";
import type {Product} from "@shared-types/db";
import {ProductItem} from "@modules/shared/components/ProductItem.tsx";

export const ProductList = React.memo((props: {
  productList: Product[],
  short?: boolean,
}) => {
  const {productList, short} = props;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {productList.map((product) => (
        <ProductItem key={product.id}
                     short={short}
                     product={product}/>
      ))}
    </div>
  );
});
