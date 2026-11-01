import { shiftDate } from "./shiftDate";

describe("shiftDate", () => {
  it("moves the date earlier or later by the same number of days", () => {
    expect(shiftDate("2025-02-20", "2025-02-14", "2025-02-10")).toBe("2025-02-16");
    expect(shiftDate("2025-02-15", "2025-02-14", "2025-02-17")).toBe("2025-02-18");
  });

  it("leaves the date alone when from and to are the same", () => {
    expect(shiftDate("2025-02-15", "2025-02-14", "2025-02-14")).toBe("2025-02-15");
  });

  it("crosses month, year and DST boundaries by whole days", () => {
    expect(shiftDate("2025-01-31", "2025-01-30", "2025-02-27")).toBe("2025-02-28");
    expect(shiftDate("2025-12-31", "2025-12-30", "2026-01-01")).toBe("2026-01-02");
    // US DST starts 2025-03-09: still exactly +1 day
    expect(shiftDate("2025-03-08", "2025-03-07", "2025-03-08")).toBe("2025-03-09");
  });
});
