import { addMinutes, minutesBetween } from "./addMinutes";

describe("addMinutes", () => {
  it("moves the time forwards or backwards on the same day", () => {
    expect(addMinutes("2025-02-14", "09:00", 90)).toEqual({ date: "2025-02-14", time: "10:30" });
    expect(addMinutes("2025-02-14", "09:00", -45)).toEqual({ date: "2025-02-14", time: "08:15" });
  });

  it("rolls the date over midnight in either direction", () => {
    expect(addMinutes("2025-02-14", "23:30", 60)).toEqual({ date: "2025-02-15", time: "00:30" });
    expect(addMinutes("2025-03-01", "00:15", -30)).toEqual({ date: "2025-02-28", time: "23:45" });
    expect(addMinutes("2025-12-31", "23:00", 120)).toEqual({ date: "2026-01-01", time: "01:00" });
  });

  it("uses wall-clock time across DST changes", () => {
    // US DST starts 2025-03-09 at 02:00: 01:30 + 1h is still 02:30 on the clock
    expect(addMinutes("2025-03-09", "01:30", 60)).toEqual({ date: "2025-03-09", time: "02:30" });
    expect(addMinutes("2025-03-08", "09:00", 24 * 60)).toEqual({ date: "2025-03-09", time: "09:00" });
  });
});

describe("minutesBetween", () => {
  it("counts wall-clock minutes, negative when going back", () => {
    expect(minutesBetween({ date: "2025-02-14", time: "09:00" }, { date: "2025-02-14", time: "09:30" })).toBe(30);
    expect(minutesBetween({ date: "2025-02-14", time: "23:30" }, { date: "2025-02-15", time: "00:30" })).toBe(60);
    expect(minutesBetween({ date: "2025-02-14", time: "09:00" }, { date: "2025-02-14", time: "08:00" })).toBe(-60);
  });
});
