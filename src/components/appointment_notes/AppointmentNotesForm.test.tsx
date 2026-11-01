import { screen } from "@testing-library/react";
import { FormProvider } from "react-hook-form";
import { renderWithProviders } from "@/test/render";
import { AppointmentNotesForm } from "./AppointmentNotesForm";
import {
  useAppointmentNotesForm,
  type TAppointmentNotesFormOutput,
} from "./useAppointmentNotesForm";

function NotesFormHarness({
  onSubmit,
}: {
  onSubmit: (values: TAppointmentNotesFormOutput) => void;
}) {
  const { submitForm, ...form } = useAppointmentNotesForm({ onSubmit });

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => void submitForm(e)} noValidate>
        <AppointmentNotesForm />
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}

describe("AppointmentNotesForm", () => {
  it("requires every field", async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithProviders(<NotesFormHarness onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Enter the chief complaint")).toBeInTheDocument();
    expect(screen.getByText("Enter a treatment plan")).toBeInTheDocument();
    expect(screen.getByText("Enter the patient's progress")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /chief complaint/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("treats whitespace-only as empty", async () => {
    const { user } = renderWithProviders(<NotesFormHarness onSubmit={jest.fn()} />);

    await user.type(screen.getByRole("textbox", { name: /chief complaint/i }), "   ");
    await user.tab();

    expect(await screen.findByText("Enter the chief complaint")).toBeInTheDocument();
  });

  it("submits trimmed values", async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithProviders(<NotesFormHarness onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /chief complaint/i }), " Broken toe ");
    await user.type(screen.getByRole("textbox", { name: /treatment plan/i }), "Toe exercises");
    await user.type(screen.getByRole("textbox", { name: /progress/i }), "Improving");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({
      chiefComplaint: "Broken toe",
      treatmentPlan: "Toe exercises",
      progress: "Improving",
    });
  });
});
