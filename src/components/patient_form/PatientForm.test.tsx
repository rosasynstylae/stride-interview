import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { PatientForm } from "./PatientForm";
import type { TPatientFormValues } from "./types";
import { usePatientForm } from "./usePatientForm";

const VALID: TPatientFormValues = {
  firstName: "Eli",
  lastName: "Dicki",
  dateOfBirth: "2003-02-25",
  phoneNumber: "(613) 538-5542",
};

/** PatientForm driven by the real usePatientForm (schema + validation timing) */
function Harness({
  defaultValues,
  onSave = () => {},
}: {
  defaultValues?: TPatientFormValues;
  onSave?: (values: TPatientFormValues) => void;
}) {
  const { submitForm, control } = usePatientForm({ defaultValues, onSubmit: onSave });

  return (
    <form onSubmit={(e) => void submitForm(e)} noValidate>
      <PatientForm control={control} />
      <button type="submit">Save</button>
    </form>
  );
}

const field = (name: RegExp) => screen.getByRole("textbox", { name });
const save = () => screen.getByRole("button", { name: "Save" });

describe("PatientForm", () => {
  it("has a labelled, required field for each detail", () => {
    renderWithProviders(<Harness />);

    for (const name of [/first name/i, /last name/i, /phone/i, /date of birth/i]) {
      expect(field(name)).toBeRequired();
    }
    expect(field(/phone/i)).toHaveAttribute("type", "tel");
  });

  it("fills the fields from default values", () => {
    renderWithProviders(<Harness defaultValues={VALID} />);

    expect(field(/first name/i)).toHaveValue("Eli");
    expect(field(/last name/i)).toHaveValue("Dicki");
    expect(field(/phone/i)).toHaveValue("(613) 538-5542");
    // The date picker shows the "YYYY-MM-DD" value in the locale's format
    expect(field(/date of birth/i)).toHaveValue("02/25/2003");
  });

  it("shows an error for every empty field on submit", async () => {
    const onSave = jest.fn();
    const { user } = renderWithProviders(<Harness onSave={onSave} />);

    await user.click(save());

    expect(await screen.findByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid phone number")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid date")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects a phone number that isn't a real US number", async () => {
    const { user } = renderWithProviders(
      <Harness defaultValues={{ ...VALID, phoneNumber: "294.334.9483 x766" }} />,
    );

    await user.click(save());

    expect(await screen.findByText("Enter a valid phone number")).toBeInTheDocument();
  });

  it("rejects a birthday in the future", async () => {
    const { user } = renderWithProviders(
      <Harness defaultValues={{ ...VALID, dateOfBirth: "2999-01-01" }} />,
    );

    await user.click(save());

    expect(
      await screen.findByText("Birthday can't be in the future"),
    ).toBeInTheDocument();
  });

  it("submits the values with the phone normalised to E.164", async () => {
    const onSave = jest.fn();
    const { user } = renderWithProviders(
      <Harness defaultValues={VALID} onSave={onSave} />,
    );

    await user.click(save());

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toEqual({ ...VALID, phoneNumber: "+16135385542" });
  });
});
