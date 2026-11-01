import { toISODateTime } from "@/utils/toISODateTime";
import type { TAppointment } from "@/utils/types/appointment";
import { toAppointmentFormValues } from "./toAppointmentFormValues";

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

    expect(values.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(values.startTime).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
    expect(values.endTime).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
  });

  // Timezone-independent: whatever the local zone, saving an unchanged form sends the same instants
  it.each([
    ["midday UTC", "2025-02-14T16:00:00.000Z", "2025-02-14T16:45:00.000Z"],
    ["just after midnight UTC", "2025-03-01T00:30:00.000Z", "2025-03-01T01:15:00.000Z"],
    ["late evening UTC", "2025-06-10T23:00:00.000Z", "2025-06-10T23:30:00.000Z"],
  ])("round-trips through toISODateTime (%s)", (_label, startTime, endTime) => {
    const values = toAppointmentFormValues(appointment(startTime, endTime));

    expect(toISODateTime(values.date, values.startTime)).toBe(startTime);
    expect(toISODateTime(values.date, values.endTime)).toBe(endTime);
  });

  it("passes type, status and provider through", () => {
    const values = toAppointmentFormValues(
      appointment("2025-02-14T16:00:00.000Z", "2025-02-14T16:45:00.000Z"),
    );

    expect(values).toMatchObject({ type: "Follow Up", status: "Scheduled", providerId: "2" });
  });
});
