import { PATIENT_URLS, PROVIDER_URLS } from "./urls";

const FETCH_PATIENT_LIST_KEY: readonly string[] = [
  PATIENT_URLS.FETCH_LIST,
] as const;

const CREATE_PATIENT_KEY: readonly string[] = [PATIENT_URLS.CREATE] as const;

const fetchPatientKey = (id: string): readonly string[] =>
  [...FETCH_PATIENT_LIST_KEY, id] as const;

const fetchPatientAppointmentsKey = (id: string): readonly string[] =>
  [...FETCH_PATIENT_LIST_KEY, id, "appointments"] as const;

const FETCH_PROVIDER_LIST_KEY: readonly string[] = [
  PROVIDER_URLS.FETCH_LIST,
] as const;

export {
  FETCH_PATIENT_LIST_KEY,
  CREATE_PATIENT_KEY,
  fetchPatientKey,
  fetchPatientAppointmentsKey,
  FETCH_PROVIDER_LIST_KEY,
};
