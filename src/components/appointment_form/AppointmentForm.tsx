import { Flex } from "@chakra-ui/react/flex";
import { type Control } from "react-hook-form";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/utils/types/appointment";
import { DateField } from "../ui/DateField";
import { SelectField, type TSelectOption } from "../ui/SelectField";
import { TextField } from "../ui/TextField";
import type { TAppointmentFormValues } from "./types";

interface TAppointmentFormProps {
  control: Control<TAppointmentFormValues>;
  providers: TSelectOption[];
}

const toOptions = (values: Record<string, string>): TSelectOption[] =>
  Object.values(values).map((v) => ({ label: v, value: v }));

const TYPE_OPTIONS = toOptions(APPOINTMENT_TYPE);
const STATUS_OPTIONS = toOptions(APPOINTMENT_STATUS);

function AppointmentForm({ control, providers }: TAppointmentFormProps) {
  return (
    <Flex direction="column" gap={4}>
      <DateField control={control} name="date" label="Date" required />
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
      <SelectField
        control={control}
        name="type"
        label="Type"
        placeholder="Select a type"
        options={TYPE_OPTIONS}
        required
      />
      <SelectField
        control={control}
        name="status"
        label="Status"
        placeholder="Select a status"
        options={STATUS_OPTIONS}
        required
      />
      <SelectField
        control={control}
        name="providerId"
        label="Provider"
        placeholder="Select a provider"
        options={providers}
        required
      />
    </Flex>
  );
}

export { AppointmentForm };
