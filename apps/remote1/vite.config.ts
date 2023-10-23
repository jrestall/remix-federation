import type { AppConfig } from "@remix-run/dev";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remixFederation from "../../packages/remix-federation/src/plugin";

const remixConfig: AppConfig = {
  ignoredRouteFiles: ["**/.*"],
};

const federationConfig = {
  name: "remote1",
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@remix-run/react": { singleton: true },
    "@remix-run/router": { singleton: true },
    "react-router": { singleton: true },
    "react-router-dom": { singleton: true },
  },
};

export default defineConfig({
  optimizeDeps: {
    include: ["react-dom/client", "react/jsx-dev-runtime"],
  },
  plugins: [tsconfigPaths(), remix(remixConfig), remixFederation(federationConfig)],
});
