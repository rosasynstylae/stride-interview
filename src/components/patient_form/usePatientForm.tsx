import { useForm } from "react-hook-form";
import type { TPatientFormValues } from "./types";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

const todayLocal = () => new Date().toLocaleDateString("en-CA");

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.iso
    .date({ error: "Enter a valid date" })
    .refine((d) => d <= todayLocal(), "Birthday can't be in the future"),
  phoneNumber: z
    .string()
    .refine((v) => isValidPhoneNumber(v, "US"), "Enter a valid phone number")
    .transform((v) => parsePhoneNumberWithError(v, "US").number),
});

const DEFAULT_VALUES: TPatientFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phoneNumber: "",
};

interface TPatientFormParams {
  onSubmit: (vals: TPatientFormValues) => void | Promise<void>;
  defaultValues?: TPatientFormValues;
}

const usePatientForm = ({
  onSubmit,
  defaultValues = DEFAULT_VALUES,
}: TPatientFormParams) => {
  const { handleSubmit, ...info } = useForm({
    defaultValues,
    resolver: zodResolver(patientSchema),
    // Validate a field once it's been left, then on every change after that
    mode: "onTouched",
  });

  return {
    submitForm: handleSubmit(onSubmit),
    ...info,
  };
};

export { usePatientForm };
