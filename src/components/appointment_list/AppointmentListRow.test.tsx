import { screen, within } from "@testing-library/react";
import { Table } from "@chakra-ui/react/table";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { AppointmentListRow } from "./AppointmentListRow";

const providers: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
];

const appointment = (overrides: Partial<TAppointment> = {}): TAppointment => ({
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

// A <tr> has to live inside a table body
const renderRow = (row: React.ReactNode) =>
  renderWithProviders(
    <Table.Root>
      <Table.Body>{row}</Table.Body>
    </Table.Root>,
  );

const cells = () => within(screen.getByRole("row")).getAllByRole("cell");

describe("AppointmentListRow", () => {
  it("shows the appointment's date, times, type and status", () => {
    renderRow(<AppointmentListRow appointment={appointment()} providers={providers} />);

    const [date, , type, status] = cells();
    expect(within(date).getByText("Feb 14, 2025")).toBeInTheDocument();
    expect(within(date).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getAllByRole("time")).toHaveLength(3); // date, start, end
    expect(type).toHaveTextContent("Initial Evaluation");
    expect(status).toHaveTextContent("Checked In");
  });

  it("shows the provider's name", () => {
    renderRow(<AppointmentListRow appointment={appointment()} providers={providers} />);

    expect(screen.getByRole("cell", { name: "Quinten Walker" })).toBeInTheDocument();
  });

  it("falls back to the provider id when the provider is unknown", () => {
    renderRow(
      <AppointmentListRow
        appointment={appointment({ providerId: "42" })}
        providers={providers}
      />,
    );

    expect(screen.getByRole("cell", { name: "Provider #42" })).toBeInTheDocument();
  });

  it("renders dateCell in place of the plain date", () => {
    renderRow(
      <AppointmentListRow
        appointment={appointment()}
        providers={providers}
        dateCell={<button type="button">Open 1</button>}
      />,
    );

    const [date] = cells();
    expect(within(date).getByRole("button", { name: "Open 1" })).toBeInTheDocument();
    expect(within(date).queryByText("Feb 14, 2025")).not.toBeInTheDocument();
    // Still five cells: the slot replaces the date, it doesn't add a column
    expect(cells()).toHaveLength(5);
  });
});
