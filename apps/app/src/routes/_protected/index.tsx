import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";

export const Route = createFileRoute("/_protected/")({
  component: RouteComponent,
});

function PrettyUser({ user }: { user: any }) {
  return <pre className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">{JSON.stringify(user ?? {}, null, 2)}</pre>;
}

function RouteComponent() {
  const auth = useSession();

  if (auth.data?.user)
    return (
      <div className="flex flex-col gap-4 py-4">
        <div>user</div>

        <div>
          <PrettyUser user={auth.data?.user} />
        </div>
      </div>
    );

  return <div>Hello "/"!</div>;
}
