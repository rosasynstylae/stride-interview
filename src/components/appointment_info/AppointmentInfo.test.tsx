import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import { AppointmentInfo } from "./AppointmentInfo";

const APPOINTMENT: TAppointment = {
  id: "1",
  patientId: "1",
  providerId: "1",
  // Midday UTC so the date is the same in any US timezone
  startTime: "2025-02-14T16:00:00.000Z",
  endTime: "2025-02-14T17:00:00.000Z",
  type: "Initial Evaluation",
  status: "Checked In",
  createdAt: "",
};

/** The <dd> paired with a <dt> label (terms don't get an accessible name, so match text) */
const valueFor = (label: string) => {
  const term = screen.getAllByRole("term").find((t) => t.textContent === label);
  const value = term?.nextElementSibling;
  if (!(value instanceof HTMLElement)) throw new Error(`No value for "${label}"`);
  return value;
};

describe("AppointmentInfo", () => {
  it("lists date & time, type, status and provider", () => {
    renderWithProviders(
      <AppointmentInfo appointment={APPOINTMENT} providerName="Quinten Walker" />,
    );

    expect(screen.getAllByRole("term").map((t) => t.textContent)).toEqual([
      "Date & time",
      "Type",
      "Status",
      "Provider",
    ]);
    expect(valueFor("Date & time")).toHaveTextContent(/^Feb 14, 2025, .+ – .+$/);
    expect(valueFor("Type")).toHaveTextContent("Initial Evaluation");
    expect(valueFor("Status")).toHaveTextContent("Checked In");
    expect(valueFor("Provider")).toHaveTextContent("Quinten Walker");
  });

  it("marks up the start and end as machine-readable times", () => {
    renderWithProviders(<AppointmentInfo appointment={APPOINTMENT} providerName="x" />);

    expect(
      [...valueFor("Date & time").querySelectorAll("time")].map((t) => t.getAttribute("datetime")),
    ).toEqual([APPOINTMENT.startTime, APPOINTMENT.endTime]);
  });
});
