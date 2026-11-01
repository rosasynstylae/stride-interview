/**
 * Ensures a base URL ends in "/". `new URL(path, base)` treats a base without one
 * as a file and drops its last segment: "https://x.io/api/v1" + "patients/"
 * resolves to "https://x.io/api/patients/".
 */
const withTrailingSlash = (url: string): string =>
  url.endsWith("/") ? url : `${url}/`;

export { withTrailingSlash };
