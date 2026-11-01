import { Flex } from "@chakra-ui/react/flex";
import { useFormContext } from "react-hook-form";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/utils/types/appointment";
import { DateField } from "../ui/DateField";
import { SelectField, type TSelectOption } from "../ui/SelectField";
import { TextField } from "../ui/TextField";
import type {
  TAppointmentFormPatientValues,
  TAppointmentFormValues,
} from "./types";

const toOptions = (values: Record<string, string>): TSelectOption[] =>
  Object.values(values).map((v) => ({ label: v, value: v }));

function AppointmentDateField() {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();

  return <DateField control={control} name="date" label="Date" required />;
}

function AppointmentTimeFields() {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <TextField
        control={control}
        name="startTime"
        label="Start time"
        type="time"
        required
      />
      <TextField
        control={control}
        name="endTime"
        label="End time"
        type="time"
        required
      />
    </Flex>
  );
}

const TYPE_OPTIONS = toOptions(APPOINTMENT_TYPE);

function AppointmentTypeField() {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();

  return (
    <SelectField
      control={control}
      name="type"
      label="Type"
      placeholder="Select a type"
      options={TYPE_OPTIONS}
      required
    />
  );
}

const STATUS_OPTIONS = toOptions(APPOINTMENT_STATUS);

function AppointmentStatusField() {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();

  return (
    <SelectField
      control={control}
      name="status"
      label="Status"
      placeholder="Select a status"
      options={STATUS_OPTIONS}
      required
    />
  );
}

interface TAppointmentProviderFieldProps {
  providers: TSelectOption[];
}

function AppointmentProviderField({
  providers,
}: TAppointmentProviderFieldProps) {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();

  return (
    <SelectField
      control={control}
      name="providerId"
      label="Provider"
      placeholder="Select a provider"
      options={providers}
      required
    />
  );
}

export {
  AppointmentDateField,
  AppointmentTimeFields,
  AppointmentTypeField,
  AppointmentStatusField,
  AppointmentProviderField,
};
