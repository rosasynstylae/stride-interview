interface TPatientInfo {
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface TPatient extends TPatientInfo {
  id: string | number;
  createdAt: string;
}

export type { TPatient, TPatientInfo };
