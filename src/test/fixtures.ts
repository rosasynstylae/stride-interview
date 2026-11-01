import type { TPatient } from "@/utils/types/patient";

/**
 * A patient whose data passes the patient form's validation (unlike some seeded
 * mockapi records, e.g. "294.334.9483 x766" isn't a real US number).
 * Birthday just after midnight UTC, so a local-time bug would show the day before.
 */
const PATIENT: TPatient = {
  id: "1",
  firstName: "Eli",
  lastName: "Dicki",
  dateOfBirth: "2003-02-25T01:44:58.013Z",
  createdAt: "2025-01-28T18:08:38.507Z",
  phoneNumber: "(613) 538-5542",
};

export { PATIENT };
