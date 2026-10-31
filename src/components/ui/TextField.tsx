import { type ComponentProps } from "react";
import { Field } from "@chakra-ui/react/field";
import { Input } from "@chakra-ui/react/input";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type TTextFieldProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = ComponentProps<typeof Input> & {
  control: Control<T>;
  name: TName;
  label: string;
};

function TextField<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({ control, name, label, ...inputProps }: TTextFieldProps<T, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root required={inputProps.required} invalid={fieldState.invalid}>
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
          <Input {...inputProps} {...field} />
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}

export { TextField };
