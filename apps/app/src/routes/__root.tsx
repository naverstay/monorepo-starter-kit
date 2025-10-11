import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Branding } from "../../../app/src/modules/shared/components/Branding";
import { config } from "config";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return <div>Not found</div>;
  },
});

function RootComponent() {
  return (
    <React.Fragment>
      <title>{config.app.name}</title>
      <Outlet />
      <Branding />
    </React.Fragment>
  );
}
