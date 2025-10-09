import { useEffect } from "react";
/* LIBRARIES */
import { Outlet, useNavigate } from "@tanstack/react-router";
/* APP */
import { LoadingPage } from "@/shared/pages/Loading";
import { useSession } from "../hooks/useAuth";

/* COMPONENT */
export const Protected = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/auth/login" });
    }
  }, [isPending, session, navigate]);

  if (isPending) {
    return <LoadingPage />;
  }

  return session ? <Outlet /> : null;
};
