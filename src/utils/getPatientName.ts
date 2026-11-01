import type { TPatient } from "./types/patient";

/**
 * "First Last" for the patient, leaving out an empty last name (no trailing
 * space), or "Patient #id" when neither name is set
 */
const getPatientName = ({
  id,
  firstName,
  lastName,
}: Pick<TPatient, "id" | "firstName" | "lastName">): string =>
  [firstName, lastName]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(" ") || `Patient #${id}`;

export { getPatientName };
