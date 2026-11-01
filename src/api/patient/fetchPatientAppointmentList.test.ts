import nock from "nock";
import { waitFor } from "@testing-library/react";
import { API_BASE_URL } from "@/test/env";
import { renderHookWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import { APIError, getFullUrl } from "../api";
import { fetchPatientAppointmentsKey } from "../keys";
import { PATIENT_URLS } from "../urls";
import {
  fetchPatientAppointmentList,
  useFetchPatientAppointmentList,
} from "./fetchPatientAppointmentList";

const APPOINTMENTS: TAppointment[] = [
  {
    id: "1",
    patientId: "1",
    providerId: "1",
    startTime: "2025-02-14T14:30:00.000Z",
    endTime: "2025-02-14T15:30:00.000Z",
    type: "Initial Evaluation",
    status: "Checked In",
    createdAt: "2025-01-30T16:51:39.006Z",
  },
  {
    id: "3",
    patientId: "1",
    providerId: "2",
    startTime: "2025-03-01T09:00:00.000Z",
    endTime: "2025-03-01T09:45:00.000Z",
    type: "Follow Up",
    status: "Scheduled",
    createdAt: "2025-02-20T10:00:00.000Z",
  },
];

/** Path nock should expect, built the same way the app builds the request URL */
const appointmentsPath = (patientId: string) =>
  getFullUrl(PATIENT_URLS.APPOINTMENTS(patientId)).pathname;

const api = () => nock(API_BASE_URL);

beforeAll(() => {
  // Fail loudly if a request slips past the mocks instead of hitting the network
  nock.disableNetConnect();
});

afterEach(() => {
  // Every test's mocks should have been used; leftovers mean a request never happened
  expect(nock.pendingMocks()).toEqual([]);
  nock.cleanAll();
});

afterAll(() => {
  nock.enableNetConnect();
});

describe("fetchPatientAppointmentList", () => {
  it("returns the patient's appointments", async () => {
    api().get(appointmentsPath("1")).reply(200, APPOINTMENTS);

    await expect(fetchPatientAppointmentList("1")).resolves.toEqual(
      APPOINTMENTS,
    );
  });

  it("returns an empty list when mockapi responds 404 for a patient with no appointments", async () => {
    api().get(appointmentsPath("3")).reply(404, "Not found");

    await expect(fetchPatientAppointmentList("3")).resolves.toEqual([]);
  });

  // Only 404 means "no appointments"; anything else is a real failure
  it.each([400, 401, 403, 500, 503])(
    "rejects with an APIError for a %i response",
    async (status) => {
      api().get(appointmentsPath("1")).reply(status, "nope");

      const request = fetchPatientAppointmentList("1");

      await expect(request).rejects.toBeInstanceOf(APIError);
      await expect(request).rejects.toMatchObject({ status });
    },
  );

  it("rejects when the request fails at the network level", async () => {
    api().get(appointmentsPath("1")).replyWithError("socket hang up");

    const request = fetchPatientAppointmentList("1");

    await expect(request).rejects.toThrow();
    await expect(request).rejects.not.toBeInstanceOf(APIError);
  });

  it("URL-encodes the patient id", async () => {
    // Pin the encoded form explicitly; the mock path alone would just mirror the app's logic
    expect(appointmentsPath("a/b c")).toBe("/patients/a%2Fb%20c/appointments");
    api().get(appointmentsPath("a/b c")).reply(200, []);

    await expect(fetchPatientAppointmentList("a/b c")).resolves.toEqual([]);
  });
});

describe("useFetchPatientAppointmentList", () => {
  it("starts pending, then returns the patient's appointments", async () => {
    api().get(appointmentsPath("1")).reply(200, APPOINTMENTS);

    const { result } = renderHookWithProviders(() =>
      useFetchPatientAppointmentList("1"),
    );

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(APPOINTMENTS);
  });

  it("succeeds with an empty list when the patient has no appointments", async () => {
    api().get(appointmentsPath("3")).reply(404, "Not found");

    const { result } = renderHookWithProviders(() =>
      useFetchPatientAppointmentList("3"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it("exposes the APIError when the request fails", async () => {
    api().get(appointmentsPath("1")).reply(500, "boom");

    const { result } = renderHookWithProviders(() =>
      useFetchPatientAppointmentList("1"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(APIError);
    expect(result.current.error).toMatchObject({ status: 500 });
  });

  it("caches the result under the patient's appointments key", async () => {
    api().get(appointmentsPath("1")).reply(200, APPOINTMENTS);

    const { result, queryClient } = renderHookWithProviders(() =>
      useFetchPatientAppointmentList("1"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // Other features invalidate by this key (e.g. after creating an appointment)
    expect(queryClient.getQueryData(fetchPatientAppointmentsKey("1"))).toEqual(
      APPOINTMENTS,
    );
  });

  it("fetches the new patient's appointments when the id changes", async () => {
    const otherAppointments = [{ ...APPOINTMENTS[0], id: "9", patientId: "2" }];
    api().get(appointmentsPath("1")).reply(200, APPOINTMENTS);
    api().get(appointmentsPath("2")).reply(200, otherAppointments);

    const { result, rerender } = renderHookWithProviders(
      ({ id }: { id: string }) => useFetchPatientAppointmentList(id),
      { initialProps: { id: "1" } },
    );
    await waitFor(() => expect(result.current.data).toEqual(APPOINTMENTS));

    rerender({ id: "2" });

    await waitFor(() => expect(result.current.data).toEqual(otherAppointments));
  });
});
