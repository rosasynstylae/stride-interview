import { useQuery } from "@tanstack/react-query";
import { APIError, apiAction, getFullUrl } from "../api";
import { PATIENT_URLS } from "../urls";
import { fetchPatientKey } from "../keys";
import type { TPatient } from "@/utils/types/patient";

const fetchPatient = (id: string): Promise<TPatient> => {
  return apiAction(getFullUrl(PATIENT_URLS.DETAILS(id)), { method: "GET" });
};

const useFetchPatient = (id: string) =>
  useQuery({
    queryKey: fetchPatientKey(id),
    queryFn: () => fetchPatient(id),
    // A missing patient won't appear on retry
    retry: (failureCount, error) =>
      !(error instanceof APIError && error.status === 404) && failureCount < 3,
  });

export { fetchPatient, useFetchPatient };
