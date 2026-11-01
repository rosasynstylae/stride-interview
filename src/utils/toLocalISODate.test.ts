import { toLocalISODate } from "./toLocalISODate";

describe("toLocalISODate", () => {
  it("formats the local calendar day as YYYY-MM-DD, zero-padded", () => {
    // Local constructor: month is 0-based
    expect(toLocalISODate(new Date(2025, 0, 5))).toBe("2025-01-05");
    expect(toLocalISODate(new Date(2025, 11, 31, 23, 59))).toBe("2025-12-31");
  });

  it("uses the local day, not the UTC day", () => {
    const lateEvening = new Date(2025, 5, 10, 23, 30);
    expect(toLocalISODate(lateEvening)).toBe("2025-06-10");
  });

  it("defaults to today", () => {
    const now = new Date();
    expect(toLocalISODate()).toBe(toLocalISODate(now));
  });
});
