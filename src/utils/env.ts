// The only place that reads import.meta.env: Jest runs CommonJS, where
// import.meta doesn't exist, so tests swap this module for src/test/env.ts
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export { API_BASE_URL };
