import { type ComponentProps } from "react";
import { Field } from "@chakra-ui/react/field";
import { Textarea } from "@chakra-ui/react/textarea";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type TTextareaFieldProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = ComponentProps<typeof Textarea> & {
  control: Control<T>;
  name: TName;
  label: string;
};

function TextareaField<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({ control, name, label, ...textareaProps }: TTextareaFieldProps<T, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root
          required={textareaProps.required}
          invalid={fieldState.invalid}
        >
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
          <Textarea autoresize {...textareaProps} {...field} />
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}

export { TextareaField };
