/** @type {import('jest').Config} */
export default {
  // jsdom plus Node's native fetch (see the file for why not a polyfill package)
  testEnvironment: "<rootDir>/jest.environment.js",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  // SWC instead of ts-jest: ts-jest doesn't support TypeScript 7
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
      },
    ],
  },
  // react-router 8 is ESM-only and uses import.meta, which can't be compiled to
  // CommonJS. Instead it's loaded via Node's native require(esm), which Jest needs
  // --experimental-vm-modules for (set in the npm scripts).
  moduleNameMapper: {
    // import.meta.env doesn't exist under Jest's CommonJS runtime
    "^@/utils/env$": "<rootDir>/src/test/env.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
