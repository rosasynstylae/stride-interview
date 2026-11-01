import { withTrailingSlash } from "./withTrailingSlash";

describe("withTrailingSlash", () => {
  it("adds a trailing slash when missing", () => {
    expect(withTrailingSlash("https://x.mockapi.io/api/v1")).toBe("https://x.mockapi.io/api/v1/");
  });

  it("leaves a URL that already ends in a slash alone", () => {
    expect(withTrailingSlash("https://x.mockapi.io/")).toBe("https://x.mockapi.io/");
  });

  it("keeps the base path when resolving API paths", () => {
    // Without the slash, "v1" would be dropped
    expect(new URL("patients/", "https://x.mockapi.io/api/v1").href).toBe(
      "https://x.mockapi.io/api/patients/",
    );
    expect(new URL("patients/", withTrailingSlash("https://x.mockapi.io/api/v1")).href).toBe(
      "https://x.mockapi.io/api/v1/patients/",
    );
  });
});
