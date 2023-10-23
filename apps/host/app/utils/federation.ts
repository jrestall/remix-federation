const IS_FETCH_PATCHED: unique symbol = Symbol("isFetchPatched");

export function setupFederation() {
  const pureFetch = globalThis.fetch;

  // Check if we have already patched global fetch
  if ((pureFetch as any)[IS_FETCH_PATCHED]) return;

  // Yea... not ideal.
  globalThis.fetch = async (input, init) => {
    if (typeof input === "string") {
      const url = new URL(input);
      const routeId = url.searchParams.get("_data");
      if (routeId) {
        url.searchParams.set("_data", "routes/remote.$");
        url.searchParams.set("_remoteData", routeId);
        input = url;
      }
    }

    // @ts-ignore
    return pureFetch(input, init);
  };

  Object.defineProperty(globalThis.fetch, IS_FETCH_PATCHED, {
    enumerable: true,
    configurable: true,
    value: true,
  });
}
