import { Box } from "@chakra-ui/react/box";
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

interface TDateTimePairProps {
  /** Which end of the appointment: "start" or "end" */
  which: "start" | "end";
}

/**
 * A date + time pair, side by side when there's room and wrapping onto two
 * lines on narrow screens (each field keeps at least ~14rem).
 */
function AppointmentDateTimePair({ which }: TDateTimePairProps) {
  const { control } = useFormContext<
    TAppointmentFormValues | TAppointmentFormPatientValues
  >();
  const label = which === "start" ? "Start" : "End";

  return (
    <Flex wrap="wrap" gap={4}>
      <Box flex="1 1 14rem" minW={0}>
        <DateField
          control={control}
          name={which === "start" ? "startDate" : "endDate"}
          label={`${label} date`}
          required
        />
      </Box>
      <Box flex="1 1 14rem" minW={0}>
        <TextField
          control={control}
          name={which === "start" ? "startTime" : "endTime"}
          label={`${label} time`}
          type="time"
          required
        />
      </Box>
    </Flex>
  );
}

function AppointmentStartFields() {
  return <AppointmentDateTimePair which="start" />;
}

function AppointmentEndFields() {
  return <AppointmentDateTimePair which="end" />;
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
  AppointmentStartFields,
  AppointmentEndFields,
  AppointmentTypeField,
  AppointmentStatusField,
  AppointmentProviderField,
};
