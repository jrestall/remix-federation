import type {
  BuildAdapter,
  BuildAdapterOptions,
  BuildResult,
} from "@softarc/native-federation/build";
import { InlineConfig, Plugin, Rollup, build } from "vite";

// A Vite based build adapter for @softarc/native-federation
export function createViteAdapter(plugins: Plugin[]): BuildAdapter {
  return async (options: BuildAdapterOptions): Promise<BuildResult[]> => {
    const { entryPoints, outdir } = options;

    if (!entryPoints?.length) return [];

    const entry = Object.fromEntries(entryPoints.map((e) => [e.outName, e.fileName]));
    const buildConfig: InlineConfig = {
      configFile: false,
      define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
      build: {
        outDir: outdir,
        lib: {
          entry: entry,
          fileName: (_format, entryName) => entryName,
          formats: ["es"],
        },
        minify: "terser",
      },
      plugins,
    };

    const outputs = await build(buildConfig);

    const fileNames: BuildResult[] = [];

    const addChunkFileNames = (output: Rollup.RollupOutput) => {
      for (const chunk of output.output) {
        fileNames.push({ fileName: chunk.fileName });
      }
    };

    if (Array.isArray(outputs)) {
      outputs.forEach((output) => addChunkFileNames(output));
    } else if ("output" in outputs) {
      addChunkFileNames(outputs);
    }

    return fileNames;
  };
}
