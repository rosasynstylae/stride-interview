import { useId, useState } from "react";
import { Flex } from "@chakra-ui/react/flex";
import { Field } from "@chakra-ui/react/field";
import { DatePicker, parseDate } from "@chakra-ui/react/date-picker";
import { LuCalendar } from "react-icons/lu";
import { Controller, type Control } from "react-hook-form";
import type { TPatientFormValues } from "./types";
import { TextField } from "../ui/TextField";

interface TPatientFormProps {
  control: Control<TPatientFormValues>;
}

function DateOfBirthField({ control }: TPatientFormProps) {
  // DatePicker doesn't read Field context, so wire the error text up by hand
  const errorId = useId();
  const [today] = useState(() =>
    parseDate(new Date().toLocaleDateString("en-CA")),
  );

  return (
    <Controller
      name="dateOfBirth"
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root required invalid={fieldState.invalid}>
          <DatePicker.Root
            name={field.name}
            required
            invalid={fieldState.invalid}
            max={today}
            // Form stores an ISO date string ("YYYY-MM-DD"); DatePicker wants DateValue[]
            value={field.value ? [parseDate(field.value)] : []}
            onValueChange={(e) => field.onChange(e.value[0]?.toString() ?? "")}
          >
            <DatePicker.Label>
              Date of birth
              <Field.RequiredIndicator />
            </DatePicker.Label>
            <DatePicker.Control>
              <DatePicker.Input
                ref={field.ref}
                onBlur={field.onBlur}
                aria-describedby={fieldState.invalid ? errorId : undefined}
              />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger aria-label="Open calendar">
                  <LuCalendar />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            {/* Not portalled: inside a Dialog, portalled content can end up behind it */}
            <DatePicker.Positioner>
              <DatePicker.Content>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                </DatePicker.View>
                <DatePicker.View view="month">
                  <DatePicker.Header />
                  <DatePicker.MonthTable />
                </DatePicker.View>
                <DatePicker.View view="year">
                  <DatePicker.Header />
                  <DatePicker.YearTable />
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>
          </DatePicker.Root>
          <Field.ErrorText id={errorId}>
            {fieldState.error?.message}
          </Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}

function PatientForm({ control }: TPatientFormProps) {
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
      <DateOfBirthField control={control} />
    </Flex>
  );
}

export { PatientForm };
