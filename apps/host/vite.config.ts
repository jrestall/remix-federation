import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { createEsBuildAdapter } from "@softarc/native-federation-esbuild";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remixFederation from "../../packages/remix-federation/src";
import config from "./remix.config.js";

export default defineConfig(async ({ command }) => {
  return {
    optimizeDeps: {
      include: ["react-dom/client", "react/jsx-dev-runtime", "@remix-run/react"],
    },
    plugins: [
      tsconfigPaths(),

      remix(config),
      await remixFederation({
        options: {
          workspaceRoot: __dirname,
          outputPath: "public/build",
          tsConfig: "tsconfig.json",
          federationConfig: "config/federation.config.cjs",
          verbose: false,
          dev: command === "serve",
        },
        adapter: createEsBuildAdapter({ plugins: [] }),
      }),
    ],
  };
});
