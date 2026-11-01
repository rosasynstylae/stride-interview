import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TAppointmentNotesFormValues } from "./types";

// trim() so whitespace-only notes don't count as filled in
const appointmentNotesSchema = z.object({
  chiefComplaint: z.string().trim().min(1, "Enter the chief complaint"),
  treatmentPlan: z.string().trim().min(1, "Enter a treatment plan"),
  progress: z.string().trim().min(1, "Enter the patient's progress"),
});

type TAppointmentNotesFormOutput = z.output<typeof appointmentNotesSchema>;

const DEFAULT_VALUES: TAppointmentNotesFormValues = {
  chiefComplaint: "",
  treatmentPlan: "",
  progress: "",
};

interface TAppointmentNotesFormParams {
  onSubmit: (vals: TAppointmentNotesFormOutput) => void | Promise<void>;
  defaultValues?: TAppointmentNotesFormValues;
}

const useAppointmentNotesForm = ({
  onSubmit,
  defaultValues = DEFAULT_VALUES,
}: TAppointmentNotesFormParams) => {
  const formInfo = useForm<
    TAppointmentNotesFormValues,
    unknown,
    TAppointmentNotesFormOutput
  >({
    defaultValues,
    resolver: zodResolver(appointmentNotesSchema),
    // Validate a field once it's been left, then on every change after that
    mode: "onTouched",
  });

  const { handleSubmit } = formInfo;

  return {
    submitForm: handleSubmit(onSubmit),
    ...formInfo,
  };
};

export type { TAppointmentNotesFormOutput };
export { useAppointmentNotesForm };
