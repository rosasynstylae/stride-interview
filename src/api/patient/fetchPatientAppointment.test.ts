import { api, apiPath, setupNock } from "@/test/nock";
import type { TAppointment } from "@/utils/types/appointment";
import { APIError } from "../api";
import { PATIENT_URLS } from "../urls";
import { fetchPatientAppointment } from "./fetchPatientAppointment";

setupNock();

const APPOINTMENT: TAppointment = {
  id: "3",
  patientId: "1",
  providerId: "2",
  startTime: "2025-02-14T16:00:00.000Z",
  endTime: "2025-02-14T17:00:00.000Z",
  type: "Follow Up",
  status: "Scheduled",
  createdAt: "2025-01-30T16:51:39.006Z",
};

describe("fetchPatientAppointment", () => {
  it("GETs patients/:patientId/appointments/:appointmentId", async () => {
    expect(apiPath(PATIENT_URLS.APPOINTMENT_DETAILS("1", "3"))).toBe(
      "/patients/1/appointments/3",
    );
    api().get("/patients/1/appointments/3").reply(200, APPOINTMENT);

    await expect(fetchPatientAppointment("1", "3")).resolves.toEqual(APPOINTMENT);
  });

  it("rejects with a 404 APIError for an unknown appointment or another patient's", async () => {
    // mockapi 404s when the appointment isn't under that patient
    api().get("/patients/2/appointments/3").reply(404, "Not found");

    const request = fetchPatientAppointment("2", "3");

    await expect(request).rejects.toBeInstanceOf(APIError);
    await expect(request).rejects.toMatchObject({ status: 404 });
  });
});
