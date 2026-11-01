import { Flex } from "@chakra-ui/react/flex";
import { useFormContext } from "react-hook-form";
import { TextField } from "../ui/TextField";
import { TextareaField } from "../ui/TextareaField";
import type { TAppointmentNotesFormValues } from "./types";

function AppointmentNotesForm() {
  const { control } = useFormContext<TAppointmentNotesFormValues>();

  return (
    <Flex direction="column" gap={4}>
      <TextField
        control={control}
        name="chiefComplaint"
        label="Chief complaint"
        required
      />
      <TextareaField
        control={control}
        name="treatmentPlan"
        label="Treatment plan"
        required
      />
      <TextareaField
        control={control}
        name="progress"
        label="Progress"
        required
      />
    </Flex>
  );
}

export { AppointmentNotesForm };
