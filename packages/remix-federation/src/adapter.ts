import type {
  BuildAdapter,
  BuildAdapterOptions,
  BuildResult,
} from "@softarc/native-federation/build";
import type { EntryPoint } from "@softarc/native-federation/src/lib/core/build-adapter";
import { InlineConfig, Plugin, Rollup, build } from "vite";

// A Vite based build adapter for @softarc/native-federation
export function createViteAdapter(plugins: Plugin[]): BuildAdapter {
  return async (options: BuildAdapterOptions): Promise<BuildResult[]> => {
    const { entryPoints, outdir } = options;

    if (!entryPoints?.length) return [];

    const fileNames: BuildResult[] = [];

    const addChunkFileNames = (output: Rollup.RollupOutput) => {
      for (const chunk of output.output) {
        fileNames.push({ fileName: chunk.fileName });
      }
    };

    // Builds each shared library independently so that no shared chunks are created between libs
    for (const entryPoint of entryPoints) {
      const outputs = await buildLibrary(entryPoint, outdir, plugins);

      if (Array.isArray(outputs)) {
        outputs.forEach((output) => addChunkFileNames(output));
      } else if ("output" in outputs) {
        addChunkFileNames(outputs);
      }
    }

    return fileNames;
  };
}

async function buildLibrary(entryPoint: EntryPoint, outDir: string, plugins: Plugin[]) {
  const buildConfig: InlineConfig = {
    configFile: false,
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      outDir: outDir,
      emptyOutDir: false,
      copyPublicDir: false,
      lib: {
        entry: { [entryPoint.outName]: entryPoint.fileName },
        fileName: (_format, entryName) => entryName,
        formats: ["es"],
      },
      minify: "esbuild",
    },
    plugins,
  };

  return await build(buildConfig);
}
