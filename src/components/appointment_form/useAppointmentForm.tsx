import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface TAppointmentFormParams {
  onSubmit: (vals: TAppointmentFormOutput) => void | Promise<void>;
  defaultValues?: TAppointmentFormValues;
}

const useAppointmentForm = ({
  onSubmit,
  defaultValues = DEFAULT_VALUES,
}: TAppointmentFormParams) => {
  const { handleSubmit, ...info } = useForm<
    TAppointmentFormValues,
    unknown,
    TAppointmentFormOutput
  >({
    defaultValues,
    resolver: zodResolver(appointmentSchema),
    // Validate a field once it's been left, then on every change after that
    mode: "onTouched",
  });

  const { watch, trigger, getFieldState } = info;

  // Only the changed field is re-validated, so moving the start time wouldn't
  // update the end time's error. Re-check it, once the user has been there.
  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name === "startTime" && getFieldState("endTime").isTouched) {
        void trigger("endTime");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger, getFieldState]);

  return {
    submitForm: handleSubmit(onSubmit),
    ...info,
  };
};

export type { TAppointmentFormOutput };
export { useAppointmentForm };
