import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";
import {PrettyJSON} from "@modules/shared/components/PrettyJSON.tsx";

export const Route = createFileRoute("/_protected/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useSession();

  if (auth.data?.user)
    return (
      <div className="flex flex-col gap-4 py-4">
        <div>user</div>

        <div>
          <PrettyJSON json={auth.data?.user} />
        </div>
      </div>
    );

  return <div>Hello "/"!</div>;
}
