import type { TAppointment } from "@/utils/types/appointment";
import { toLocalISODate } from "@/utils/toLocalISODate";
import type { TAppointmentFormValues } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "HH:mm" (24h, local time), as <input type="time"> expects. Built from parts,
 * like toLocalISODate, rather than relying on a locale's time format.
 */
const toLocalTime = (iso: string): string => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * API appointment → form values. The inverse of toISODateTime: both use the
 * viewer's local time, so saving an unchanged form sends the same instants back.
 * (Appointments are instants, unlike birthdays, which are read in UTC.)
 */
const toAppointmentFormValues = (
  appointment: TAppointment,
): TAppointmentFormValues => ({
  date: toLocalISODate(new Date(appointment.startTime)),
  startTime: toLocalTime(appointment.startTime),
  endTime: toLocalTime(appointment.endTime),
  type: appointment.type,
  status: appointment.status,
  providerId: appointment.providerId,
});

export { toAppointmentFormValues };
