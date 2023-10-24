import {
  BuildAdapter,
  BuildHelperParams,
  federationBuilder,
} from "@softarc/native-federation/build";
import type { FederationConfig as NativeFederationConfig } from "@softarc/native-federation/src/lib/config/federation-config";
import MagicString from "magic-string";
import { Plugin } from "vite";
import externalize from "vite-plugin-externalize-dependencies";
import { createViteAdapter } from "./adapter";
import { writeFederationConfig } from "./config";

const defaultOptions = {
  workspaceRoot: process.cwd(),
  outputPath: "public/",
  tsConfig: "tsconfig.json",
  federationConfig: "node_modules/.tmp/federation.config.cjs",
  verbose: false,
  dev: true,
};

export const defaultExternals = ["react", "react-dom", "react/jsx-dev-runtime"];

export type FederationConfig = {
  options?: Partial<BuildHelperParams["options"]>;
  adapter?: BuildHelperParams["adapter"];
} & NativeFederationConfig;

/**
 * Creates a Vite plugin that implements native module federation for remix
 *
 * @param federationConfig - The federation config.
 *
 * @returns The Vite plugin.
 */
export default async function vitePluginRemixFederation(
  federationConfig?: FederationConfig,
): Promise<Plugin[]> {
  async function initFederation(buildAdapter: BuildAdapter, initConfig: boolean = true) {
    const resolvedOptions = { ...defaultOptions, ...federationConfig?.options };

    if (initConfig && federationConfig && !federationConfig.options?.federationConfig) {
      // Strip out react deps since we use esm.sh to provide these
      const config = { ...federationConfig };
      config.shared ??= {};
      for (const external of defaultExternals) {
        delete config.shared[external];
      }

      writeFederationConfig(config, resolvedOptions);
    }

    return federationBuilder.init({
      options: resolvedOptions,
      adapter: buildAdapter,
    });
  }

  // Initial init to get externals for the externalize plugin
  await initFederation(federationConfig?.adapter!);

  const externals = [...federationBuilder.externals, ...defaultExternals];
  const sharedPlugins: Plugin[] = [
    externalize({ externals: externals }),
    {
      name: "vite-plugin-remix-federation-externals",
      enforce: "post",
      config: () => ({
        build: {
          rollupOptions: {
            external: externals,
          },
        },
      }),
    },
    {
      name: "vite-plugin-remix-federation-module-shim",
      enforce: "post",
      config(config) {
        // We need to ssr transform @remix-run/react so don't externalize it from vite's transform module
        // https://vitejs.dev/guide/ssr.html#ssr-externals
        // TODO: Get @remix-run/react patch below working.
      },
      transform(code, id) {
        // Transform Remix's LiveReload component to use <script type="module-shim" />
        // so that they are loaded by es-module-shim.
        if (id === "\0virtual:remix-react-proxy") {
          return {
            code: code.replace('type: "module"', 'type: "module-shim"'),
          };
        }

        // Transform Remix's Scripts component code to use <script type="module-shim" />
        // and <link rel="modulepreload-shim" /> so that they are loaded by es-module-shim and cached properly.
        // https://github.com/guybedford/es-module-shims#shim-mode
        // https://github.com/guybedford/es-module-shims#preload-shim
        if (
          id.match(/^@remix-run\/react/g) ||
          id.includes("@remix-run_react") ||
          id.includes("@remix-run/react/dist/esm/components.js")
        ) {
          const magicString = new MagicString(code);
          magicString.replaceAll('type: "module"', 'type: "module-shim"');
          magicString.replaceAll('rel: "modulepreload"', 'rel: "modulepreload-shim"');
          return {
            code: magicString.toString(),
            map: magicString.generateMap(),
          };
        }
      },
      // Useful when Remix supports SPA Mode in the future.
      // transformIndexHtml(html: string) {
      //   return html.replace(/type="module"/g, 'type="module-shim"');
      // },
    },
  ];

  async function buildFederation() {
    return federationBuilder.build();
  }

  return [
    {
      name: "vite-plugin-remix-federation",
      async configResolved(config) {
        // Second init to automatically set development option and build adapter
        defaultOptions.dev = config.command === "serve";
        await initFederation(federationConfig?.adapter ?? createViteAdapter(sharedPlugins), false);
      },
      async buildStart() {
        // Build native federation files such as remoteEntry.js and shared deps
        await buildFederation();
      },
      async configureServer() {
        // Rebuild on dev server restart
        await buildFederation();
      },
    },
    ...sharedPlugins,
  ];
}
