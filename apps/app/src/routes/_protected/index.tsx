import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/auth";

export const Route = createFileRoute("/_protected/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useSession();

  if (auth.data?.user) return <>user es</>;

  return <div>Hello "/"!</div>;
}
