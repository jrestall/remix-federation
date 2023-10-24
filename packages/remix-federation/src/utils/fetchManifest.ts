import type { AssetsManifest } from "@remix-run/dev";
import { combineUrls } from "./combineUrls";

const defaultImmutableHostRoutes = ["root", "routes/_index", "routes/[manifest.json]"];

export async function fetchManifest(
  baseUrl: string,
  fileName: string = "manifest.json",
  immutableHostRoutes: string[] = defaultImmutableHostRoutes,
): Promise<AssetsManifest> {
  const manifestURL = combineUrls(baseUrl, fileName);
  const manifest = await fetchRemoteManifest(manifestURL);

  // Make remote module urls absolute so they load directly from the remote
  for (const route of Object.values(manifest.routes)) {
    route.module = combineUrls(baseUrl, route.module);
  }

  // Remove the protected host routes from the remote's manifest as we don't want to support overriding these.
  // Other routes could be overriden by remotes as a way for client's to customize and extend the base site though.
  for (const routeId of immutableHostRoutes) {
    delete manifest.routes[routeId];
  }

  return manifest;
}

async function fetchRemoteManifest(url: string): Promise<AssetsManifest> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch remote route manifest with status ${response.status}`);
  }

  return await response.json();
}
