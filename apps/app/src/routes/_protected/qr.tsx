import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";
import { PageQRGenerator } from "@modules/shared/components/QrCodeScanner.tsx";

export const Route = createFileRoute("/_protected/qr")({
  component: QrRouteComponent,
});

function QrRouteComponent() {
  const auth = useSession();

  if (!auth.data?.user) {
    return <div>⛔ Доступ запрещён. Войдите в систему.</div>;
  }

  return <PageQRGenerator />;
}
