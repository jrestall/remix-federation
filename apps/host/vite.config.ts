import type { AppConfig } from "@remix-run/dev";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remixFederation from "../../packages/remix-federation/src";

const remixConfig: AppConfig = {
  ignoredRouteFiles: ["**/.*"],
};

const federationConfig = {
  name: "host",
  remotes: {
    remote1: "remote1@http://localhost:5174/build/remoteEntry.js",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};

export default defineConfig(async ({ command }) => {
  return {
    optimizeDeps: {
      include: ["react-dom/client", "react/jsx-dev-runtime"],
    },
    plugins: [tsconfigPaths(), remix(remixConfig), remixFederation(federationConfig)],
  };
});
