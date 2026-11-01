import type { TAppointment } from "@/utils/types/appointment";
import type { TAppointmentFormValues } from "./types";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "HH:mm" (24h, local time), as <input type="time"> expects */
const toLocalTime = (iso: string): string => timeFormat.format(new Date(iso));

/**
 * API appointment → form values. The inverse of toISODateTime: both use the
 * viewer's local time, so saving an unchanged form sends the same instants back.
 * (Appointments are instants, unlike birthdays, which are read in UTC.)
 */
const toAppointmentFormValues = (
  appointment: TAppointment,
): TAppointmentFormValues => ({
  date: new Date(appointment.startTime).toLocaleDateString("en-CA"),
  startTime: toLocalTime(appointment.startTime),
  endTime: toLocalTime(appointment.endTime),
  type: appointment.type,
  status: appointment.status,
  providerId: appointment.providerId,
});

export { toAppointmentFormValues };
