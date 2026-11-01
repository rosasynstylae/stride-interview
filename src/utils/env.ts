import { withTrailingSlash } from "./withTrailingSlash";

// The only place that reads import.meta.env: Jest runs CommonJS, where
// import.meta doesn't exist, so tests swap this module for src/test/env.ts
// Trailing slash guaranteed so a base with a path (".../api/v1") keeps it
const API_BASE_URL: string = withTrailingSlash(import.meta.env.VITE_API_BASE_URL);

export { API_BASE_URL };
