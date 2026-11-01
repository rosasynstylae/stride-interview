import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { renderWithProviders } from "@/test/render";
import { TextField } from "./TextField";

interface TValues {
  firstName: string;
}

const schema = z.object({
  firstName: z.string().min(1, "Enter a first name"),
});

interface THarnessProps extends Omit<
  React.ComponentProps<typeof TextField<TValues>>,
  "control" | "name" | "label"
> {
  defaultValue?: string;
  onSave?: (values: TValues) => void;
}

/** A minimal form around one TextField, validated on blur like the app's forms */
function Harness({ defaultValue = "", onSave = () => {}, ...inputProps }: THarnessProps) {
  const { control, handleSubmit } = useForm<TValues>({
    defaultValues: { firstName: defaultValue },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  return (
    <form onSubmit={(e) => void handleSubmit(onSave)(e)} noValidate>
      <TextField control={control} name="firstName" label="First name" {...inputProps} />
      <button type="submit">Save</button>
    </form>
  );
}

const input = () => screen.getByRole("textbox", { name: /first name/i });

describe("TextField", () => {
  it("labels the input", () => {
    renderWithProviders(<Harness />);

    expect(input()).toBeInTheDocument();
  });

  it("shows the form's value and writes typed text back to the form", async () => {
    const onSave = jest.fn();
    const { user } = renderWithProviders(
      <Harness defaultValue="Kar" onSave={onSave} />,
    );

    expect(input()).toHaveValue("Kar");

    await user.type(input(), "son");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      { firstName: "Karson" },
      expect.anything(),
    );
  });

  it("marks the field required only when asked", () => {
    const { unmount } = renderWithProviders(<Harness />);
    expect(input()).not.toBeRequired();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
    unmount();

    renderWithProviders(<Harness required />);
    expect(input()).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows the validation error and ties it to the input", async () => {
    const { user } = renderWithProviders(<Harness required />);

    // No error until the field has been visited
    expect(input()).not.toHaveAttribute("aria-invalid", "true");

    await user.click(input());
    await user.tab();

    expect(await screen.findByText("Enter a first name")).toBeInTheDocument();
    expect(input()).toHaveAttribute("aria-invalid", "true");
    // Chakra links the error via aria-errormessage (plus an aria-live region), not aria-describedby
    expect(input()).toHaveAccessibleErrorMessage("Enter a first name");
  });

  it("clears the error once the value is valid", async () => {
    const { user } = renderWithProviders(<Harness required />);

    await user.click(input());
    await user.tab();
    expect(await screen.findByText("Enter a first name")).toBeInTheDocument();

    await user.type(input(), "Karson");

    expect(screen.queryByText("Enter a first name")).not.toBeInTheDocument();
    expect(input()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("passes input props through", () => {
    renderWithProviders(<Harness type="email" autoComplete="given-name" placeholder="Jane" />);

    expect(screen.getByRole("textbox", { name: /first name/i })).toHaveAttribute(
      "type",
      "email",
    );
    expect(input()).toHaveAttribute("autocomplete", "given-name");
    expect(input()).toHaveAttribute("placeholder", "Jane");
  });
});
