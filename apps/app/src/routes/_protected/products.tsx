import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";
import { ProductListWithFilters } from "@modules/shared/components/ProductListWithFilters";

export const Route = createFileRoute("/_protected/products")({
  component: ProductsRouteComponent,
});

function ProductsRouteComponent() {
  const auth = useSession();

  if (!auth.data?.user) {
    return <div>⛔ Доступ запрещён. Войдите в систему.</div>;
  }

  return <ProductListWithFilters />;
}
