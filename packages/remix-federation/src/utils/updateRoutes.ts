import type { AssetsManifest } from "@remix-run/dev";

export async function updateRoutes(
  assetsManifest: AssetsManifest,
  shouldRevalidate: boolean = true,
) {
  // @ts-ignore
  const router = window.__remixRouter;

  // This should never happen, but we are using internal APIs...
  if (!router) {
    console.error("Failed to update routes because the Remix router was not available.");
    return;
  }

  Object.assign(window.__remixManifest.routes, assetsManifest.routes);

  // Create new routes
  let routes = router.createRoutesForHMR(
    false,
    window.__remixManifest.routes,
    window.__remixRouteModules,
    window.__remixContext.future,
  );

  // This is a temporary API and will change in the future, hopefully an addRoute function will be added.
  router._internalSetRoutes(routes);

  // Revalidate all the loaders so that the new routes are loaded and rendered.
  if (shouldRevalidate) {
    router.revalidate();
  }
}
