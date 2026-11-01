import type { TAppointment } from "@/utils/types/appointment";
import { toLocalISODate } from "@/utils/toLocalISODate";
import { toLocalTime } from "@/utils/toLocalTime";
import type { TAppointmentFormValues } from "./types";

/**
 * API appointment → form values. The inverse of toAppointmentInstants: both use
 * the viewer's local time, so saving an unchanged form sends the same instants
 * back. Start and end each get their own date, so appointments that cross
 * midnight load correctly. (Appointments are instants, unlike birthdays.)
 */
const toAppointmentFormValues = (
  appointment: TAppointment,
): TAppointmentFormValues => {
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);

  return {
    startDate: toLocalISODate(start),
    startTime: toLocalTime(start),
    endDate: toLocalISODate(end),
    endTime: toLocalTime(end),
    type: appointment.type,
    status: appointment.status,
    providerId: appointment.providerId,
  };
};

export { toAppointmentFormValues };
