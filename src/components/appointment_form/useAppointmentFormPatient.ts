import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TAppointmentFormPatientValues } from "./types";
import { useAppointmentEndSync } from "./useAppointmentEndSync";
import {
  APPOINTMENT_FORM_DEFAULT_VALUES,
  appointmentSchema,
} from "./appointmentSchema";

// safeExtend keeps appointmentSchema's end-after-start refinement
const appointmentPatientSchema = appointmentSchema.safeExtend({
  patientId: z.string().min(1, "Choose a patient"),
});

type TAppointmentFormPatientOutput = z.output<typeof appointmentPatientSchema>;

const DEFAULT_VALUES: TAppointmentFormPatientValues = {
  ...APPOINTMENT_FORM_DEFAULT_VALUES,
  patientId: "",
};

interface TAppointmentFormPatientParams {
  onSubmit: (vals: TAppointmentFormPatientOutput) => void | Promise<void>;
  defaultValues?: TAppointmentFormPatientValues;
}

const useAppointmentFormPatient = ({
  onSubmit,
  defaultValues = DEFAULT_VALUES,
}: TAppointmentFormPatientParams) => {
  const formInfo = useForm<
    TAppointmentFormPatientValues,
    unknown,
    TAppointmentFormPatientOutput
  >({
    defaultValues,
    resolver: zodResolver(appointmentPatientSchema),
    // Validate a field once it's been left, then on every change after that
    mode: "onTouched",
  });

  useAppointmentEndSync(formInfo);

  const { handleSubmit } = formInfo;

  return {
    submitForm: handleSubmit(onSubmit),
    ...formInfo,
  };
};

export type { TAppointmentFormPatientOutput };
export { useAppointmentFormPatient };
