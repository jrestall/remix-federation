import { BuildHelperParams, federationBuilder } from "@softarc/native-federation/build.js";
import MagicString from "magic-string";
import { Plugin } from "vite";
import externalize from "vite-plugin-externalize-dependencies";

/**
 * Creates a Vite plugin that implements native module federation for remix
 *
 * @param params - The native federation build helper params.
 *
 * @returns The Vite plugin.
 */
export default async function vitePluginRemixFederation(
  params: BuildHelperParams,
): Promise<Plugin[]> {
  await federationBuilder.init(params);
  return [
    externalize({ externals: federationBuilder.externals }),
    {
      name: "vite-plugin-remix-federation",
      async buildStart() {
        await federationBuilder.build({ skipMappingsAndExposed: true });
      },
    },
    {
      name: "vite-plugin-remix-federation-module-shim",
      enforce: "post",
      config(config) {
        // We need to ssr transform @remix-run/react so don't externalize it from vite's transform module
        // https://vitejs.dev/guide/ssr.html#ssr-externals
        config.ssr ??= {};
        config.ssr.noExternal = ["@remix-run/react"];
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
}
