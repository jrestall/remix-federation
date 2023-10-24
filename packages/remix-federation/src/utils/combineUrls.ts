/**
 * Creates a new Url by combining the specified Urls
 *
 * @param {string} baseUrl The base Url
 * @param {string} relativeUrl The relative Url
 * @returns {string} The combined Url
 */
export function combineUrls(baseUrl: string, relativeUrl: string) {
  return relativeUrl
    ? baseUrl.replace(/\/+$/, "") + "/" + relativeUrl.replace(/^\/+/, "")
    : baseUrl;
}
