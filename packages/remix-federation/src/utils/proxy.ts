export function proxy(baseUrl: string, request: Request) {
  const origUrl = new URL(request.url);
  const proxyUrl = new URL(origUrl.pathname + origUrl.search, baseUrl);
  const routeId = proxyUrl.searchParams.get("_remoteData");
  if (routeId) {
    proxyUrl.searchParams.delete("_remoteData");
    proxyUrl.searchParams.set("_data", routeId);

    console.log(`Proxying request to '${routeId}' from 'remote.$'`);
    return fetch(proxyUrl, request);
  }
}
