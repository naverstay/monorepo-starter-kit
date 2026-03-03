import {createFileRoute} from "@tanstack/react-router";
import {useSession} from "@modules/auth";
import {NutritionHelper} from "@modules/shared/components/NutritionHelper.tsx";

export const Route = createFileRoute("/_protected/nutrition")({
  component: ProductsRouteComponent,
});

function ProductsRouteComponent() {
  const auth = useSession();

  if (!auth.data?.user) {
    return <div>⛔ Доступ запрещён. Войдите в систему.</div>;
  }

  return <NutritionHelper/>;
}
