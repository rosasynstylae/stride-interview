const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled",
  CHECKED_IN: "Checked In",
  CANCELLED: "Cancelled",
} as const;

type TAppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

const APPOINTMENT_TYPE = {
  INITIAL_EVAL: "Initial Evaluation",
  FOLLOW_UP: "Follow Up",
  DISCHARGE: "Discharge",
} as const;

type TAppointmentType =
  (typeof APPOINTMENT_TYPE)[keyof typeof APPOINTMENT_TYPE];

interface TAppointment {
  id: string;
  patientId: string;
  providerId: string;
  startTime: string;
  endTime: string;
  type: TAppointmentType;
  status: TAppointmentStatus;
  createdAt: string;
}

export { APPOINTMENT_STATUS };
export type { TAppointment, TAppointmentStatus };
