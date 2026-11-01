const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "YYYY-MM-DD" for the date's local calendar day. Built from its parts
 */
const toLocalISODate = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export { toLocalISODate };
