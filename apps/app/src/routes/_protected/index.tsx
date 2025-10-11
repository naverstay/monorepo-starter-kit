import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";

export const Route = createFileRoute("/_protected/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useSession();

  if (auth.data?.user)
    return (
      <>
        <div>user</div>
        <div>{JSON.stringify(auth.data?.user ?? {})}</div>
      </>
    );

  return <div>Hello "/"!</div>;
}
