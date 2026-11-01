import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TAppointmentFormValues } from "./types";
import { useAppointmentEndSync } from "./useAppointmentEndSync";
import {
  APPOINTMENT_FORM_DEFAULT_VALUES,
  appointmentSchema,
  type TAppointmentFormOutput,
} from "./appointmentSchema";

interface TAppointmentFormParams {
  onSubmit: (vals: TAppointmentFormOutput) => void | Promise<void>;
  defaultValues?: TAppointmentFormValues;
}

const useAppointmentForm = ({
  onSubmit,
  defaultValues = APPOINTMENT_FORM_DEFAULT_VALUES,
}: TAppointmentFormParams) => {
  const formInfo = useForm<
    TAppointmentFormValues,
    unknown,
    TAppointmentFormOutput
  >({
    defaultValues,
    resolver: zodResolver(appointmentSchema),
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

export { useAppointmentForm };
