const PATIENT_URLS = {
  FETCH_LIST: "patients/",
  CREATE: "patients/",
  DETAILS: (id: string | number) => `patients/${encodeURIComponent(id)}`,
  UPDATE: (id: string | number) => `patients/${encodeURIComponent(id)}`,
  APPOINTMENTS: (id: string) =>
    `patients/${encodeURIComponent(id)}/appointments`,
} as const;

const PROVIDER_URLS = {
  FETCH_LIST: "providers/",
} as const;

const APPOINTMENT_NOTES_URLS = {
  LIST: (patientId: string, appointmentId: string) =>
    `${PATIENT_URLS.APPOINTMENTS(patientId)}/${encodeURIComponent(appointmentId)}/notes`,
  CREATE: (patientId: string, appointmentId: string) =>
    `${PATIENT_URLS.APPOINTMENTS(patientId)}/${encodeURIComponent(appointmentId)}/notes`,
  UPDATE: (patientId: string, appointmentId: string, notesId: string) =>
    `${APPOINTMENT_NOTES_URLS.LIST(patientId, appointmentId)}/${encodeURIComponent(notesId)}`,
} as const;

export { PATIENT_URLS, PROVIDER_URLS, APPOINTMENT_NOTES_URLS };
