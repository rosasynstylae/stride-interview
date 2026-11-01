import { addMinutes } from "./addMinutes";

/**
 * One hour after a local date ("YYYY-MM-DD") + time ("HH:mm"). The date moves
 * to the next day when the hour crosses midnight (23:30 → 00:30 the day after).
 */
const addHour = (date: string, time: string): { date: string; time: string } =>
  addMinutes(date, time, 60);

export { addHour };
