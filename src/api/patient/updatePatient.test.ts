import { act } from "@testing-library/react";
import { toaster } from "@/components/ui/toaster";
import { PATIENT } from "@/test/fixtures";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderHookWithProviders } from "@/test/render";
import type { TPatientInfo } from "@/utils/types/patient";
import { APIError } from "../api";
import {
  FETCH_PATIENT_LIST_KEY,
  fetchPatientAppointmentsKey,
  fetchPatientKey,
} from "../keys";
import { PATIENT_URLS } from "../urls";
import { updatePatient, useUpdatePatient } from "./updatePatient";

setupNock();

const INFO: TPatientInfo = {
  firstName: "Elias",
  lastName: "Dicki",
  dateOfBirth: "2003-02-25T12:00:00.000Z",
  phoneNumber: "+16135385542",
};

const UPDATED = { ...PATIENT, ...INFO };
// Body matchers below spread INFO: nock's matcher type needs an index signature, which an interface lacks

describe("updatePatient", () => {
  it("PUTs the patient info as JSON to patients/:id and returns the saved patient", async () => {
    api()
      .matchHeader("content-type", "application/json")
      .put(apiPath(PATIENT_URLS.UPDATE("1")), { ...INFO })
      .reply(200, UPDATED);

    await expect(
      updatePatient({ patientId: "1", patientInfo: INFO }),
    ).resolves.toEqual(UPDATED);
  });

  it("accepts a numeric id", async () => {
    api().put("/patients/7", { ...INFO }).reply(200, UPDATED);

    await expect(updatePatient({ patientId: 7, patientInfo: INFO })).resolves.toEqual(
      UPDATED,
    );
  });

  it("URL-encodes the patient id", async () => {
    api().put("/patients/a%2Fb", { ...INFO }).reply(200, UPDATED);

    await expect(
      updatePatient({ patientId: "a/b", patientInfo: INFO }),
    ).resolves.toEqual(UPDATED);
  });

  it.each([400, 404, 500])("rejects with an APIError for a %i response", async (status) => {
    api().put(apiPath(PATIENT_URLS.UPDATE("1"))).reply(status, "nope");

    const request = updatePatient({ patientId: "1", patientInfo: INFO });

    await expect(request).rejects.toBeInstanceOf(APIError);
    await expect(request).rejects.toMatchObject({ status });
  });
});

describe("useUpdatePatient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("refreshes the patient and the patient list, but not their appointments", async () => {
    api().put(apiPath(PATIENT_URLS.UPDATE("1"))).reply(200, UPDATED);
    const { result, queryClient } = renderHookWithProviders(() => useUpdatePatient());

    // Seed the cache as if the details page had already loaded
    queryClient.setQueryData(fetchPatientKey("1"), PATIENT);
    queryClient.setQueryData(FETCH_PATIENT_LIST_KEY, [PATIENT]);
    queryClient.setQueryData(fetchPatientAppointmentsKey("1"), []);

    await act(() => result.current.mutateAsync({ patientId: "1", patientInfo: INFO }));

    const isStale = (key: readonly string[]) =>
      queryClient.getQueryState(key)?.isInvalidated;
    expect(isStale(fetchPatientKey("1"))).toBe(true);
    expect(isStale(FETCH_PATIENT_LIST_KEY)).toBe(true);
    // fetchPatientKey("1") is a prefix of this key; exact: true keeps it untouched
    expect(isStale(fetchPatientAppointmentsKey("1"))).toBe(false);
  });

  it("shows an error toast when saving fails", async () => {
    const createToast = jest.spyOn(toaster, "create");
    api().put(apiPath(PATIENT_URLS.UPDATE("1"))).reply(500, "boom");
    const { result } = renderHookWithProviders(() => useUpdatePatient());

    await act(async () => {
      await expect(
        result.current.mutateAsync({ patientId: "1", patientInfo: INFO }),
      ).rejects.toBeInstanceOf(APIError);
    });

    expect(createToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error", title: "Couldn't save the patient" }),
    );
  });
});
