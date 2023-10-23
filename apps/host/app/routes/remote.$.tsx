import type { DataFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchManifest } from "app/utils/fetchManifest";
import { remotes } from "app/utils/remotes";
import { updateRoutes } from "app/utils/updateRoutes";
import { useEffect } from "react";

export function loader({ request }: DataFunctionArgs) {
  // Proxy data fetches to the remote app
  const response = proxy(remotes.remote1, request);
  if (response) return response;

  // Fetch the remote app's route manifest as this routes loader data
  return fetchManifest(remotes.remote1);
}

export function action({ request }: DataFunctionArgs) {
  // Proxy data mutations to the remote app
  const response = proxy(remotes.remote1, request);
  if (response) return response;
}

function proxy(baseUrl: string, request: Request) {
  const origUrl = new URL(request.url);
  const proxyUrl = new URL(origUrl.pathname + origUrl.search, baseUrl);
  const routeId = proxyUrl.searchParams.get("_remoteData");
  if (routeId) {
    proxyUrl.searchParams.delete("_remoteData");
    proxyUrl.searchParams.set("_data", routeId);

    console.log(`Proxying request to '${routeId}' from 'remote.$'`);
    return fetch(proxyUrl, request);
  }
}

export default function Component() {
  const manifest = useLoaderData<typeof loader>();

  // Loads the remote app's route manifest and then revalidates
  // the router to rerender the current url with the new routes.
  useEffect(() => {
    updateRoutes(manifest);
  }, [manifest]);

  return <div>Loading...</div>;
}

export { ErrorBoundary } from "../components/ErrorBoundary";
