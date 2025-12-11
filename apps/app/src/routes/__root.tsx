import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Branding } from "@modules/shared/components/Branding.tsx";
import { config } from "config";
import appCss from "../index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // your meta tags and site config
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
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
