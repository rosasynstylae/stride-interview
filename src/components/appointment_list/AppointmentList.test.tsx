import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { AppointmentList } from "./AppointmentList";

const providers: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
];

const appointment = (overrides: Partial<TAppointment>): TAppointment => ({
  id: "1",
  patientId: "1",
  providerId: "1",
  startTime: "2025-02-14T14:30:00.000Z",
  endTime: "2025-02-14T15:30:00.000Z",
  type: "Initial Evaluation",
  status: "Checked In",
  createdAt: "",
  ...overrides,
});

describe("AppointmentList", () => {
  it("labels the table with its heading", () => {
    renderWithProviders(
      <AppointmentList appointments={[]} providers={providers} />,
    );

    expect(
      screen.getByRole("table", { name: "Appointments" }),
    ).toBeInTheDocument();
  });

  it("shows the provider's name, falling back to the id when unknown", () => {
    renderWithProviders(
      <AppointmentList
        appointments={[
          appointment({ id: "1", providerId: "1" }),
          appointment({ id: "2", providerId: "42" }),
        ]}
        providers={providers}
      />,
    );

    expect(screen.getByRole("cell", { name: "Quinten Walker" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Provider #42" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no appointments", () => {
    renderWithProviders(
      <AppointmentList appointments={[]} providers={providers} />,
    );

    expect(screen.getByText("No Appointments Found")).toBeInTheDocument();
  });

  it("adds a visually hidden 'Notes' column only when a row action is given", () => {
    const { rerender } = renderWithProviders(
      <AppointmentList appointments={[appointment({})]} providers={providers} />,
    );
    expect(screen.queryByRole("columnheader", { name: "Notes" })).not.toBeInTheDocument();

    rerender(
      <AppointmentList
        appointments={[appointment({})]}
        providers={providers}
        renderRowAction={(a) => <button type="button">Notes for {a.id}</button>}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Notes" })).toBeInTheDocument();
    const row = screen.getAllByRole("row")[1];
    expect(within(row).getByRole("button", { name: "Notes for 1" })).toBeInTheDocument();
  });
});
