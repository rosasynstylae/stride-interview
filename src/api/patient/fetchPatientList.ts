// base url: https://6ae241a6bbb541292299d06c.mockapi.io/

import { useQuery } from "@tanstack/react-query";
import { apiAction, getFullUrl } from "../api";
import { PATIENT_URLS } from "../urls";
import { FETCH_PATIENT_LIST_KEY } from "../keys";
import type { TPatient } from "@/utils/types/patient";

const fetchPatientList = (): Promise<TPatient[]> => {
  return apiAction(getFullUrl(PATIENT_URLS.FETCH_LIST));
};

const useFetchPatientList = () =>
  useQuery({
    queryKey: FETCH_PATIENT_LIST_KEY,
    queryFn: fetchPatientList,
  });

export { fetchPatientList, useFetchPatientList };
