import { useState } from "react";
import { Flex } from "@chakra-ui/react/flex";
import { parseDate } from "@chakra-ui/react/date-picker";
import { type Control } from "react-hook-form";
import type { TPatientFormValues } from "./types";
import { TextField } from "../ui/TextField";
import { DateField } from "../ui/DateField";

interface TPatientFormProps {
  control: Control<TPatientFormValues>;
}

function PatientForm({ control }: TPatientFormProps) {
  const [today] = useState(() =>
    parseDate(new Date().toLocaleDateString("en-CA")),
  );

  return (
    <Flex direction="column" gap={4}>
      <TextField
        control={control}
        name="firstName"
        label="First name"
        autoComplete="given-name"
        required
      />
      <TextField
        control={control}
        name="lastName"
        label="Last name"
        autoComplete="family-name"
        required
      />
      <TextField
        control={control}
        name="phoneNumber"
        label="Phone"
        type="tel"
        autoComplete="tel"
        required
      />
      <DateField
        control={control}
        name="dateOfBirth"
        label="Date of birth"
        max={today}
        required
      />
    </Flex>
  );
}

export { PatientForm };
