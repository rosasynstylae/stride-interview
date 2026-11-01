interface TAppointmentNotes {
  id: string;
  appointmentId: string;
  createdAt: string;
  chiefComplaint: string;
  treatmentPlan: string;
  progress: string;
}

type TAppointmentNotesInfo = Omit<TAppointmentNotes, "id" | "createdAt">;

export type { TAppointmentNotes, TAppointmentNotesInfo };
