import { useId, type ComponentProps } from "react";
import { Field } from "@chakra-ui/react/field";
import { DatePicker, parseDate } from "@chakra-ui/react/date-picker";
import { LuCalendar } from "react-icons/lu";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type TDateValue = ComponentProps<typeof DatePicker.Root>["max"];
type TDateValues = NonNullable<ComponentProps<typeof DatePicker.Root>["value"]>;

interface TDateFieldProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  control: Control<T>;
  name: TName;
  label: string;
  required?: boolean;
  min?: TDateValue;
  max?: TDateValue;
}

/**
 * Form value ("YYYY-MM-DD") → DatePicker value. parseDate throws on anything
 * else, which would crash the page mid-render; show an empty picker instead and
 * let the form's schema report the bad value as a field error.
 */
function toDateValues(value: unknown): TDateValues {
  if (typeof value !== "string" || !value) return [];
  try {
    return [parseDate(value)];
  } catch {
    return [];
  }
}

function DateField<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({ control, name, label, required, min, max }: TDateFieldProps<T, TName>) {
  // DatePicker doesn't read Field context, so wire the error text up by hand
  const errorId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root required={required} invalid={fieldState.invalid}>
          <DatePicker.Root
            name={field.name}
            required={required}
            invalid={fieldState.invalid}
            min={min}
            max={max}
            // Form stores an ISO date string ("YYYY-MM-DD"); DatePicker wants DateValue[]
            value={toDateValues(field.value)}
            onValueChange={(e) => field.onChange(e.value[0]?.toString() ?? "")}
          >
            <DatePicker.Label>
              {label}
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

export { DateField };
