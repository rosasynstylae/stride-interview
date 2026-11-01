import { getProviderById } from "./getProviderById";
import type { TProvider } from "./types/provider";

const providers: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
  { id: "2", firstName: "Lavada", lastName: "Wilkinson", createdAt: "" },
];

describe("getProviderById", () => {
  it("returns the provider with a matching id", () => {
    expect(getProviderById(providers, "2")?.firstName).toBe("Lavada");
  });

  it("returns undefined when no provider matches", () => {
    expect(getProviderById(providers, "99")).toBeUndefined();
  });
});
