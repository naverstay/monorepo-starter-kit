import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/auth/pages/Login";

export const Route = createFileRoute("/auth/_auth/login")({
  component: Login,
});

function Login() {
  return <LoginPage />;
}
