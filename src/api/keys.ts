import { PATIENT_URLS } from "./urls";

const FETCH_PATIENT_LIST_KEY: readonly string[] = [
  PATIENT_URLS.FETCH_LIST,
] as const;

const CREATE_PATIENT_KEY: readonly string[] = [PATIENT_URLS.CREATE] as const;

export { FETCH_PATIENT_LIST_KEY, CREATE_PATIENT_KEY };
