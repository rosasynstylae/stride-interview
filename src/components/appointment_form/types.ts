interface TAppointmentFormValues {
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  providerId: string;
}

interface TAppointmentFormPatientValues extends TAppointmentFormValues {
  patientId: string;
}

export type { TAppointmentFormValues, TAppointmentFormPatientValues };
