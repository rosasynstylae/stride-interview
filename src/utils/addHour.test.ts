import { addHour } from "./addHour";

describe("addHour", () => {
  it("adds an hour on the same day", () => {
    expect(addHour("2025-02-14", "09:00")).toEqual({ date: "2025-02-14", time: "10:00" });
    expect(addHour("2025-02-14", "09:45")).toEqual({ date: "2025-02-14", time: "10:45" });
  });

  it("moves to the next day when the hour crosses midnight", () => {
    expect(addHour("2025-02-14", "23:30")).toEqual({ date: "2025-02-15", time: "00:30" });
  });

  it("rolls over month and year ends", () => {
    expect(addHour("2025-01-31", "23:15")).toEqual({ date: "2025-02-01", time: "00:15" });
    expect(addHour("2025-12-31", "23:00")).toEqual({ date: "2026-01-01", time: "00:00" });
  });
});
