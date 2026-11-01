import type { TPatient } from "@/utils/types/patient";
import type { TPatientFormValues } from "./types";

/**
 * API patient → form values. The API stores dateOfBirth as a full ISO datetime
 * ("2006-09-20T16:33:50.410Z"); the form and DatePicker want "YYYY-MM-DD".
 * Birthdays are read in UTC (like formatBirthDate), so take the UTC date part.
 */
const toPatientFormValues = (patient: TPatient): TPatientFormValues => ({
  firstName: patient.firstName,
  lastName: patient.lastName,
  /* TODO: if this was prod-ready, I'd properly parse this
   * rather than just ignoring the time.
   * However, timezones lead to complications that
   * feel outside the scope. Right now, I'll just get it working.
   */
  dateOfBirth: patient.dateOfBirth.slice(0, 10),
  phoneNumber: patient.phoneNumber,
});

export { toPatientFormValues };
