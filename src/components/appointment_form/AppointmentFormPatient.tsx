import { Flex } from "@chakra-ui/react/flex";
import { useFormContext } from "react-hook-form";
import { SelectField, type TSelectOption } from "../ui/SelectField";
import type { TAppointmentFormPatientValues } from "./types";
import {
  AppointmentDateField,
  AppointmentProviderField,
  AppointmentStatusField,
  AppointmentTimeFields,
  AppointmentTypeField,
} from "./FormFields";

interface TAppointmentPatientFieldProps {
  patients: TSelectOption[];
}

function AppointmentPatientField({ patients }: TAppointmentPatientFieldProps) {
  const { control } = useFormContext<TAppointmentFormPatientValues>();

  return (
    <SelectField
      control={control}
      name="patientId"
      label="Patient"
      placeholder="Select a patient"
      options={patients}
      required
    />
  );
}

interface TAppointmentFormPatientProps {
  patients: TSelectOption[];
  providers: TSelectOption[];
}

// Same fields as AppointmentForm plus a patient picker. Not built by nesting
// <AppointmentForm>: Control<T> is invariant, so it'd need an unsafe cast.
// instead, use composible field components.
function AppointmentFormPatient({
  patients,
  providers,
}: TAppointmentFormPatientProps) {
  return (
    <Flex direction="column" gap={4}>
      <AppointmentPatientField patients={patients} />
      <AppointmentDateField />
      <AppointmentTimeFields />
      <AppointmentTypeField />
      <AppointmentStatusField />
      <AppointmentProviderField providers={providers} />
    </Flex>
  );
}

export { AppointmentFormPatient };
