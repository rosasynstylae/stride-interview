const pad = (n: number) => String(n).padStart(2, "0");

/** Local "YYYY-MM-DD" + "HH:mm" as wall-clock minutes (UTC is used as a DST-free counter) */
const toWallMinutes = (date: string, time: string): number => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return Date.UTC(year, month - 1, day, hours, minutes) / 60_000;
};

/**
 * Moves a local date + time by `minutes` of wall-clock time (negative goes back),
 * rolling the date over midnight as needed: ("2025-02-14", "23:30", 60) →
 * { date: "2025-02-15", time: "00:30" }. Wall-clock means daylight-saving changes
 * don't skew the result: 09:00 + 1 day is 09:00 the next day.
 */
const addMinutes = (
  date: string,
  time: string,
  minutes: number,
): { date: string; time: string } => {
  const moved = new Date((toWallMinutes(date, time) + minutes) * 60_000);
  return {
    date: `${moved.getUTCFullYear()}-${pad(moved.getUTCMonth() + 1)}-${pad(moved.getUTCDate())}`,
    time: `${pad(moved.getUTCHours())}:${pad(moved.getUTCMinutes())}`,
  };
};

/** Wall-clock minutes from one local date + time to another */
const minutesBetween = (
  from: { date: string; time: string },
  to: { date: string; time: string },
): number => toWallMinutes(to.date, to.time) - toWallMinutes(from.date, from.time);

export { addMinutes, minutesBetween };
