import { toProviderOptions } from "./selectOptions";
import type { TProvider } from "./types/provider";

const PROVIDERS: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
  { id: "2", firstName: "Lavada", lastName: "Wilkinson", createdAt: "" },
];

describe("toProviderOptions", () => {
  it("maps providers to name/id options", () => {
    expect(toProviderOptions(PROVIDERS)).toEqual([
      { label: "Quinten Walker", value: "1" },
      { label: "Lavada Wilkinson", value: "2" },
    ]);
  });

  it("doesn't duplicate the current provider when it's in the list", () => {
    expect(toProviderOptions(PROVIDERS, "2")).toHaveLength(2);
  });

  it("adds the current provider first when it's missing from the list", () => {
    expect(toProviderOptions(PROVIDERS, "9")[0]).toEqual({ label: "Provider #9", value: "9" });
  });

  it("still offers the current provider when the list is empty (loading or failed)", () => {
    expect(toProviderOptions([], "1")).toEqual([{ label: "Provider #1", value: "1" }]);
  });
});
