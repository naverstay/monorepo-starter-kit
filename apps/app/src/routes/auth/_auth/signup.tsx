import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "@/auth/pages/SignUp";

export const Route = createFileRoute("/auth/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpPage />;
}
