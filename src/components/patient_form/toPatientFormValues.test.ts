import { toPatientFormValues } from "./toPatientFormValues";
import type { TPatient } from "@/utils/types/patient";

const patient: TPatient = {
  id: "2",
  firstName: "Destin",
  lastName: "Beer",
  // Just after midnight UTC: a local-time conversion would give Jun 4 in the Americas
  dateOfBirth: "1975-06-05T01:43:27.064Z",
  createdAt: "2025-01-28T07:02:17.829Z",
  phoneNumber: "877-207-9329 x6119",
};

describe("toPatientFormValues", () => {
  it("converts the ISO datetime birthday to the UTC calendar date", () => {
    expect(toPatientFormValues(patient).dateOfBirth).toBe("1975-06-05");
  });

  it("keeps only the form's fields", () => {
    expect(toPatientFormValues(patient)).toEqual({
      firstName: "Destin",
      lastName: "Beer",
      dateOfBirth: "1975-06-05",
      phoneNumber: "877-207-9329 x6119",
    });
  });
});
