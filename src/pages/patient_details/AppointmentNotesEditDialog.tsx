import { useUpdateAppointmentNotes } from "@/api/appointment_notes/updateAppointmentNotes";
import { useAppointmentNotesForm } from "@/components/appointment_notes/useAppointmentNotesForm";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import { AppointmentNotesDialogContent } from "./AppointmentNotesDialogContent";

interface TAppointmentNotesEditDialogProps {
  patientId: string;
  notes: TAppointmentNotes;
  onClose: () => void;
}

function AppointmentNotesEditDialog({
  patientId,
  notes,
  onClose,
}: TAppointmentNotesEditDialogProps) {
  const { mutateAsync } = useUpdateAppointmentNotes();

  const { submitForm, ...form } = useAppointmentNotesForm({
    // Remounted on every open (see AppointmentNotesDialog), so these are always the latest saved notes
    defaultValues: {
      chiefComplaint: notes.chiefComplaint,
      treatmentPlan: notes.treatmentPlan,
      progress: notes.progress,
    },
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          patientId,
          appointmentId: notes.appointmentId,
          notesId: notes.id,
          notes: { ...values, appointmentId: notes.appointmentId },
        });
        onClose();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  return (
    <AppointmentNotesDialogContent
      title="Edit notes"
      form={form}
      submitForm={submitForm}
    />
  );
}

export { AppointmentNotesEditDialog };
