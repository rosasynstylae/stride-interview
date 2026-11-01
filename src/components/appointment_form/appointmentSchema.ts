import z from "zod";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/utils/types/appointment";
import type { TAppointmentFormValues } from "./types";

const appointmentDateTimes = z.object({
  // "YYYY-MM-DD" from the date picker, "HH:mm" from <input type="time">
  startDate: z.iso.date({ error: "Enter a start date" }),
  startTime: z.iso.time({ precision: -1, error: "Enter a start time" }),
  endDate: z.iso.date({ error: "Enter an end date" }),
  endTime: z.iso.time({ precision: -1, error: "Enter an end time" }),
});

const appointmentSchema = z
  .object({
    ...appointmentDateTimes.shape,
    // string in (selects start empty), enum out
    type: z.string().pipe(z.enum(APPOINTMENT_TYPE, { error: "Choose a type" })),
    status: z
      .string()
      .pipe(z.enum(APPOINTMENT_STATUS, { error: "Choose a status" })),
    providerId: z.string().min(1, "Choose a provider"),
  })
  // Zero-padded "YYYY-MM-DDTHH:mm" strings compare correctly as text, across days too
  .refine(
    (v) => `${v.endDate}T${v.endTime}` > `${v.startDate}T${v.startTime}`,
    {
      path: ["endTime"],
      message: "End must be after start",
      // By default Zod skips object refinements when another field (e.g. an
      // empty select) fails; only the four date/time fields matter here
      when: (payload) => appointmentDateTimes.safeParse(payload.value).success,
    },
  );

type TAppointmentFormOutput = z.output<typeof appointmentSchema>;

const DEFAULT_VALUES: TAppointmentFormValues = {
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  type: "",
  status: "",
  providerId: "",
};

export type { TAppointmentFormOutput };
export { appointmentSchema, DEFAULT_VALUES as APPOINTMENT_FORM_DEFAULT_VALUES };
