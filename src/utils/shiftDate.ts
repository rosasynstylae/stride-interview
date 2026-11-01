const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" → that calendar day at UTC midnight (no DST in UTC, so day maths stays exact) */
const toUTCDay = (date: string): number => Date.parse(`${date}T00:00:00Z`);

/**
 * Moves `date` by however many calendar days lie between `from` and `to`
 * (all "YYYY-MM-DD"). E.g. shifting an end date by the same amount its start
 * date moved: shiftDate("2025-02-20", "2025-02-14", "2025-02-10") → "2025-02-16".
 */
const shiftDate = (date: string, from: string, to: string): string => {
  const days = Math.round((toUTCDay(to) - toUTCDay(from)) / DAY_MS);
  return new Date(toUTCDay(date) + days * DAY_MS).toISOString().slice(0, 10);
};

export { shiftDate };
