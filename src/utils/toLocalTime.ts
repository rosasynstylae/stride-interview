const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "HH:mm" (24h) for the date's local time, as <input type="time"> expects. Built
 * from its parts, like toLocalISODate, rather than relying on a locale's format.
 */
const toLocalTime = (date: Date): string =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export { toLocalTime };
