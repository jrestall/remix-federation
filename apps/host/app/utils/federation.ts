import { matchRoutes } from "@remix-run/react";

const IS_FETCH_PATCHED: unique symbol = Symbol("isFetchPatched");

export function setupFederation() {
  const pureFetch = globalThis.fetch;

  // Check if we have already patched global fetch
  if ((pureFetch as any)[IS_FETCH_PATCHED]) return;

  // Yea... not ideal.
  globalThis.fetch = async (input, init) => {
    if (typeof input === "string") {
      const url = new URL(input);
      const routeId = url.searchParams.get("_data");
      if (routeId) {
        const splatRouteId = getMatchingSplatRoute(url);
        if (splatRouteId) {
          url.searchParams.set("_data", splatRouteId);
          url.searchParams.set("_remoteData", routeId);
          input = url;
        }
      }
    }

    // @ts-ignore
    return pureFetch(input, init);
  };

  Object.defineProperty(globalThis.fetch, IS_FETCH_PATCHED, {
    enumerable: true,
    configurable: true,
    value: true,
  });
}

export function getMatchingSplatRoute(url: URL) {
  // Gets all splat routes and returns the first that matches the requested url.
  const routes = Object.values(window.__remixManifest.routes);
  const splatRoutes = routes.filter((route) => route.id.endsWith("$"));

  const matches = matchRoutes(splatRoutes, { pathname: url.pathname });
  if (!matches || matches.length === 0) return;

  return matches[0].route.id;
}
