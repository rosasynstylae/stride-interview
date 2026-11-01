import { act } from "@testing-library/react";
import { toaster } from "@/components/ui/toaster";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderHookWithProviders } from "@/test/render";
import type { TAppointment, TAppointmentInfo } from "@/utils/types/appointment";
import { APIError } from "../api";
import {
  fetchAppointmentNotesListKey,
  fetchPatientAppointmentKey,
  fetchPatientAppointmentsKey,
} from "../keys";
import { PATIENT_URLS } from "../urls";
import {
  updatePatientAppointment,
  useUpdatePatientAppointment,
} from "./updatePatientAppointment";

setupNock();

const INFO: TAppointmentInfo = {
  patientId: "1",
  providerId: "2",
  startTime: "2025-02-14T17:00:00.000Z",
  endTime: "2025-02-14T17:45:00.000Z",
  type: "Follow Up",
  status: "Scheduled",
};

const UPDATED: TAppointment = { ...INFO, id: "3", createdAt: "2025-01-30T16:51:39.006Z" };

const PATH = apiPath(PATIENT_URLS.APPOINTMENT_DETAILS("1", "3"));

describe("updatePatientAppointment", () => {
  it("PUTs the appointment as JSON to patients/:id/appointments/:appointmentId", async () => {
    expect(PATH).toBe("/patients/1/appointments/3");
    api()
      .matchHeader("content-type", "application/json")
      // Spread: nock's body matcher type needs an index signature, which an interface lacks
      .put(PATH, { ...INFO })
      .reply(200, UPDATED);

    await expect(
      updatePatientAppointment({ patientId: "1", appointmentId: "3", appointmentInfo: INFO }),
    ).resolves.toEqual(UPDATED);
  });

  it.each([400, 404, 500])("rejects with an APIError for a %i response", async (status) => {
    api().put(PATH).reply(status, "nope");

    const request = updatePatientAppointment({
      patientId: "1",
      appointmentId: "3",
      appointmentInfo: INFO,
    });

    await expect(request).rejects.toBeInstanceOf(APIError);
    await expect(request).rejects.toMatchObject({ status });
  });
});

describe("useUpdatePatientAppointment", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("refreshes the appointment and the table, but not the appointment's notes", async () => {
    api().put(PATH).reply(200, UPDATED);
    const { result, queryClient } = renderHookWithProviders(() => useUpdatePatientAppointment());

    // Seed the cache as if the drawer and table had loaded
    queryClient.setQueryData(fetchPatientAppointmentKey("1", "3"), UPDATED);
    queryClient.setQueryData(fetchPatientAppointmentsKey("1"), [UPDATED]);
    queryClient.setQueryData(fetchAppointmentNotesListKey("1", "3"), []);

    await act(() =>
      result.current.mutateAsync({ patientId: "1", appointmentId: "3", appointmentInfo: INFO }),
    );

    const isStale = (key: readonly string[]) => queryClient.getQueryState(key)?.isInvalidated;
    expect(isStale(fetchPatientAppointmentKey("1", "3"))).toBe(true);
    expect(isStale(fetchPatientAppointmentsKey("1"))).toBe(true);
    // Both keys above are prefixes of this one; exact: true leaves it alone
    expect(isStale(fetchAppointmentNotesListKey("1", "3"))).toBe(false);
  });

  it("shows a success toast, or an error toast when saving fails", async () => {
    const createToast = jest.spyOn(toaster, "create");
    api().put(PATH).reply(200, UPDATED);
    api().put(PATH).reply(500, "boom");
    const { result } = renderHookWithProviders(() => useUpdatePatientAppointment());
    const vars = { patientId: "1", appointmentId: "3", appointmentInfo: INFO };

    await act(() => result.current.mutateAsync(vars));
    expect(createToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "success", title: "Appointment saved" }),
    );

    await act(async () => {
      await expect(result.current.mutateAsync(vars)).rejects.toBeInstanceOf(APIError);
    });
    expect(createToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "error", title: "Couldn't save the appointment" }),
    );
  });
});
