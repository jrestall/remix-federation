// @ts-expect-error
import manifest from "virtual:server-manifest";

// Exposes the remote's route manifest on a consistent url to be used by host apps
export async function loader() {
  return manifest;
}
