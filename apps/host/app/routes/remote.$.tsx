import { useLoaderData } from "@remix-run/react";
import { fetchManifest } from "app/utils/fetchManifest";
import { remotes } from "app/utils/remotes";
import { updateRoutes } from "app/utils/updateRoutes";
import { useEffect } from "react";

export function loader() {
  // Fetch the remote app's route manifest
  return fetchManifest(remotes.remote1);
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
