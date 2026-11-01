import { Field } from "@chakra-ui/react/field";
import { NativeSelect } from "@chakra-ui/react/native-select";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface TSelectOption {
  label: string;
  value: string;
}

interface TSelectFieldProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  control: Control<T>;
  name: TName;
  label: string;
  options: TSelectOption[];
  placeholder?: string;
  required?: boolean;
}

function SelectField<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  name,
  label,
  options,
  placeholder,
  required,
}: TSelectFieldProps<T, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root required={required} invalid={fieldState.invalid}>
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
          {/* Native <select>: reads Field context, and has the best keyboard/screen reader support */}
          <NativeSelect.Root>
            <NativeSelect.Field placeholder={placeholder} {...field}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}

export type { TSelectOption };
export { SelectField };
