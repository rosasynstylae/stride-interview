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

  it("shows the plain date by default", () => {
    renderWithProviders(
      <AppointmentList appointments={[appointment({})]} providers={providers} />,
    );

    const row = screen.getAllByRole("row")[1];
    expect(within(row).getByText("Feb 14, 2025")).toBeInTheDocument();
    expect(within(row).queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the date cell through renderDateCell when given", () => {
    renderWithProviders(
      <AppointmentList
        appointments={[appointment({})]}
        providers={providers}
        renderDateCell={(a) => <button type="button">Open {a.id}</button>}
      />,
    );

    const [dateCell] = within(screen.getAllByRole("row")[1]).getAllByRole("cell");
    expect(within(dateCell).getByRole("button", { name: "Open 1" })).toBeInTheDocument();
    // Still five columns: the slot replaces the date, it doesn't add a column
    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
  });
});
