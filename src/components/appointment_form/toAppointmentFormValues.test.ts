import type { TAppointment } from "@/utils/types/appointment";
import { toAppointmentFormValues } from "./toAppointmentFormValues";
import { toAppointmentInstants } from "./toAppointmentInstants";

const appointment = (startTime: string, endTime: string): TAppointment => ({
  id: "1",
  patientId: "1",
  providerId: "2",
  startTime,
  endTime,
  type: "Follow Up",
  status: "Scheduled",
  createdAt: "",
});

describe("toAppointmentFormValues", () => {
  it("produces the shapes the form's inputs expect", () => {
    const values = toAppointmentFormValues(
      appointment("2025-02-14T16:00:00.000Z", "2025-02-14T16:45:00.000Z"),
    );

    for (const date of [values.startDate, values.endDate]) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    for (const time of [values.startTime, values.endTime]) {
      expect(time).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
    }
  });

  // Timezone-independent: whatever the local zone, saving an unchanged form sends the same instants
  it.each([
    ["midday UTC", "2025-02-14T16:00:00.000Z", "2025-02-14T16:45:00.000Z"],
    ["just after midnight UTC", "2025-03-01T00:30:00.000Z", "2025-03-01T01:15:00.000Z"],
    ["late evening UTC", "2025-06-10T23:00:00.000Z", "2025-06-10T23:30:00.000Z"],
    ["ends the next day", "2025-06-10T22:00:00.000Z", "2025-06-12T00:00:00.000Z"],
  ])("round-trips through toAppointmentInstants (%s)", (_label, startTime, endTime) => {
    const values = toAppointmentFormValues(appointment(startTime, endTime));

    expect(toAppointmentInstants(values)).toEqual({ startTime, endTime });
  });

  it("gives the end its own date when the appointment crosses into another day", () => {
    // 26 hours apart: over a day, so a different local calendar day in every timezone
    const values = toAppointmentFormValues(
      appointment("2025-06-10T22:00:00.000Z", "2025-06-12T00:00:00.000Z"),
    );

    expect(values.endDate > values.startDate).toBe(true);
  });

  it("passes type, status and provider through", () => {
    const values = toAppointmentFormValues(
      appointment("2025-02-14T16:00:00.000Z", "2025-02-14T16:45:00.000Z"),
    );

    expect(values).toMatchObject({ type: "Follow Up", status: "Scheduled", providerId: "2" });
  });
});
