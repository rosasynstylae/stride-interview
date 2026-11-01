import { act, screen, waitFor, within } from "@testing-library/react";
import { PATIENT_URLS } from "@/api/urls";
import { toAppointmentFormValues } from "@/components/appointment_form/toAppointmentFormValues";
import { Toaster } from "@/components/ui/toaster";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { AppointmentInfoContainer } from "./AppointmentInfoContainer";

setupNock();

const APPOINTMENT: TAppointment = {
  id: "3",
  patientId: "1",
  providerId: "1",
  // Midday UTC so the displayed date is the same in any US timezone
  startTime: "2025-02-14T16:00:00.000Z",
  endTime: "2025-02-14T16:45:00.000Z",
  type: "Initial Evaluation",
  status: "Scheduled",
  createdAt: "",
};

const PROVIDERS: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
  { id: "2", firstName: "Lavada", lastName: "Wilkinson", createdAt: "" },
];

const PATH = apiPath(PATIENT_URLS.APPOINTMENT_DETAILS("1", "3"));

/** Toaster's mount update is flushed inside act() */
async function renderContainer(providers: TProvider[] = PROVIDERS) {
  const result = renderWithProviders(
    <>
      <AppointmentInfoContainer appointment={APPOINTMENT} providers={providers} />
      <Toaster />
    </>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return result;
}

const editButton = () => screen.getByRole("button", { name: "Edit appointment" });
const select = (name: RegExp) => screen.getByRole("combobox", { name });

describe("AppointmentInfoContainer", () => {
  it("shows the appointment's info with an Edit appointment button below it", async () => {
    await renderContainer();

    expect(screen.getByText("Initial Evaluation")).toBeInTheDocument();
    expect(screen.getByText("Quinten Walker")).toBeInTheDocument();
    const lastTerm = screen.getAllByRole("term").at(-1)!;
    // Below the info: after it in reading order
    expect(lastTerm.compareDocumentPosition(editButton()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("switches to a form pre-filled with the appointment", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());

    const expected = toAppointmentFormValues(APPOINTMENT);
    expect(screen.getByRole("form", { name: "Edit appointment" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /start date/i })).toHaveValue("02/14/2025");
    expect(screen.getByRole("textbox", { name: /end date/i })).toHaveValue("02/14/2025");
    expect(screen.getByLabelText(/start time/i)).toHaveValue(expected.startTime);
    expect(screen.getByLabelText(/end time/i)).toHaveValue(expected.endTime);
    expect(select(/type/i)).toHaveValue("Initial Evaluation");
    expect(select(/status/i)).toHaveValue("Scheduled");
    expect(select(/provider/i)).toHaveValue("1");
  });

  it("keeps the current provider selected when the providers list is empty (loading or failed)", async () => {
    const { user } = await renderContainer([]);

    await user.click(editButton());

    // Not the "Select a provider" placeholder: the real current value, which is what gets saved
    expect(select(/provider/i)).toHaveValue("1");
    expect(within(select(/provider/i)).getByRole("option", { selected: true })).toHaveTextContent("Provider #1");
  });

  it("moves focus into the form, and back to the Edit button on cancel", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());
    await waitFor(() => expect(screen.getByRole("textbox", { name: /start date/i })).toHaveFocus());

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(editButton()).toHaveFocus();
  });

  it("saves with a PUT of ISO times, returns to the info view, and confirms", async () => {
    let body: Record<string, unknown> | undefined;
    api()
      .put(PATH, (b: Record<string, unknown>) => {
        body = b;
        return true;
      })
      .reply(200, {});
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.selectOptions(select(/status/i), "Checked In");
    await user.selectOptions(select(/provider/i), "2");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Appointment saved")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("form")).not.toBeInTheDocument());
    expect(body).toEqual({
      patientId: "1",
      providerId: "2",
      type: "Initial Evaluation",
      status: "Checked In",
      // Unchanged date/times go back as the same instants
      startTime: APPOINTMENT.startTime,
      endTime: APPOINTMENT.endTime,
    });
  });

  it("stays in the form and shows a toast when saving fails", async () => {
    api().put(PATH).reply(500, "boom");
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.selectOptions(select(/status/i), "Cancelled");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Couldn't save the appointment")).toBeInTheDocument();
    expect(select(/status/i)).toHaveValue("Cancelled");
  });
});
