import z from "zod";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/utils/types/appointment";
import type { TAppointmentFormValues } from "./types";

const appointmentTimes = z.object({
  // "HH:mm", as produced by <input type="time">
  startTime: z.iso.time({ precision: -1, error: "Enter a start time" }),
  endTime: z.iso.time({ precision: -1, error: "Enter an end time" }),
});

const appointmentSchema = z
  .object({
    date: z.iso.date({ error: "Enter a valid date" }),
    ...appointmentTimes.shape,
    // string in (selects start empty), enum out
    type: z.string().pipe(z.enum(APPOINTMENT_TYPE, { error: "Choose a type" })),
    status: z
      .string()
      .pipe(z.enum(APPOINTMENT_STATUS, { error: "Choose a status" })),
    providerId: z.string().min(1, "Choose a provider"),
  })
  // Zero-padded "HH:mm" strings compare correctly as text
  .refine((v) => v.endTime > v.startTime, {
    path: ["endTime"],
    message: "End time must be after start time",
    // By default Zod skips object refinements when another field (e.g. an
    // empty select) fails; only the two times matter here
    when: (payload) => appointmentTimes.safeParse(payload.value).success,
  });

type TAppointmentFormOutput = z.output<typeof appointmentSchema>;

const DEFAULT_VALUES: TAppointmentFormValues = {
  date: "",
  startTime: "",
  endTime: "",
  type: "",
  status: "",
  providerId: "",
};

export type { TAppointmentFormOutput };
export { appointmentSchema, DEFAULT_VALUES as APPOINTMENT_FORM_DEFAULT_VALUES };
