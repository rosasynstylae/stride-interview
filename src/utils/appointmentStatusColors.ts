import type { TAppointmentStatus } from "./types/appointment";

/** Chakra colorPalette for each appointment status badge */
const APPOINTMENT_STATUS_COLORS: Record<TAppointmentStatus, string> = {
  Scheduled: "blue",
  "Checked In": "green",
  Cancelled: "red",
};

export { APPOINTMENT_STATUS_COLORS };
