import { toISODateTime } from "@/utils/toISODateTime";
import type { TAppointmentFormValues } from "./types";

type TAppointmentDateTimes = Pick<
  TAppointmentFormValues,
  "startDate" | "startTime" | "endDate" | "endTime"
>;

/**
 * Form date/time fields → the API's ISO startTime/endTime. Each end of the
 * appointment uses its own date, so one ending after midnight saves correctly.
 */
const toAppointmentInstants = ({
  startDate,
  startTime,
  endDate,
  endTime,
}: TAppointmentDateTimes): { startTime: string; endTime: string } => ({
  startTime: toISODateTime(startDate, startTime),
  endTime: toISODateTime(endDate, endTime),
});

export { toAppointmentInstants };
