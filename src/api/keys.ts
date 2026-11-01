import { PATIENT_URLS, PROVIDER_URLS } from "./urls";

const FETCH_PATIENT_LIST_KEY: readonly string[] = [
  PATIENT_URLS.FETCH_LIST,
] as const;

const CREATE_PATIENT_KEY: readonly string[] = [PATIENT_URLS.CREATE] as const;

const fetchPatientKey = (id: string): readonly string[] =>
  [...FETCH_PATIENT_LIST_KEY, id] as const;

const fetchPatientAppointmentsKey = (id: string): readonly string[] =>
  [...FETCH_PATIENT_LIST_KEY, id, "appointments"] as const;

const CREATE_PATIENT_APPOINTMENT_KEY: readonly string[] = [
  ...FETCH_PATIENT_LIST_KEY,
  "appointments",
  "create",
] as const;

const FETCH_PROVIDER_LIST_KEY: readonly string[] = [
  PROVIDER_URLS.FETCH_LIST,
] as const;

// Nested under the patient's appointments key so invalidating that also refreshes notes
const fetchAppointmentNotesListKey = (
  patientId: string,
  appointmentId: string,
): readonly string[] =>
  [...fetchPatientAppointmentsKey(patientId), appointmentId, "notes"] as const;

const CREATE_APPOINTMENT_NOTES_KEY: readonly string[] = [
  ...FETCH_PATIENT_LIST_KEY,
  "appointments",
  "notes",
  "create",
] as const;

const UPDATE_APPOINTMENT_NOTES_KEY: readonly string[] = [
  ...FETCH_PATIENT_LIST_KEY,
  "appointments",
  "notes",
  "update",
] as const;

export {
  FETCH_PATIENT_LIST_KEY,
  CREATE_PATIENT_KEY,
  fetchPatientKey,
  fetchPatientAppointmentsKey,
  CREATE_PATIENT_APPOINTMENT_KEY,
  FETCH_PROVIDER_LIST_KEY,
  fetchAppointmentNotesListKey,
  CREATE_APPOINTMENT_NOTES_KEY,
  UPDATE_APPOINTMENT_NOTES_KEY,
};
