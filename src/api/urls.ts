const PATIENT_URLS = {
  FETCH_LIST: "patients/",
  CREATE: "patients/",
  DETAILS: (id: string) => `patients/${encodeURIComponent(id)}`,
  APPOINTMENTS: (id: string) =>
    `patients/${encodeURIComponent(id)}/appointments`,
} as const;

const PROVIDER_URLS = {
  FETCH_LIST: "providers/",
} as const;

export { PATIENT_URLS, PROVIDER_URLS };
