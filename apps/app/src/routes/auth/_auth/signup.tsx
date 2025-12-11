import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "@modules/auth/pages/SignUp";

export const Route = createFileRoute("/auth/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpPage />;
}
