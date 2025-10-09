/* LIBRARIES */
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/* APP */
import { AxiosProvider } from "./Axios";

const queryClient = new QueryClient();
const persister = createAsyncStoragePersister({ storage: window.localStorage });

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/* COMPONENT */
export const Providers = () => {
  return (
    <>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <AxiosProvider>
          <RouterProvider router={router} />
        </AxiosProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </>
  );
};
