import nock from "nock";
import { getFullUrl } from "@/api/api";
import { API_BASE_URL } from "./env";

/** nock scope for the (test) API base URL */
const api = () => nock(API_BASE_URL);

/** Path nock should expect, built the same way the app builds the request URL */
const apiPath = (url: string) => getFullUrl(url).pathname;

/**
 * Standard nock lifecycle for a test file: block real network, require every
 * mock to be used, and clean up between tests. Call once at the top level.
 */
function setupNock() {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    // Leftover mocks mean a request the test expected never happened.
    // Clean up before asserting, so a failure here can't leak mocks into the next test.
    const pending = nock.pendingMocks();
    nock.cleanAll();
    expect(pending).toEqual([]);
  });

  afterAll(() => {
    nock.enableNetConnect();
  });
}

export { api, apiPath, setupNock };
