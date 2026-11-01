import { useCreateAppointmentNotes } from "@/api/appointment_notes/createAppointmentNotes";
import { useAppointmentNotesForm } from "@/components/appointment_notes/useAppointmentNotesForm";
import { AppointmentNotesDialogContent } from "./AppointmentNotesDialogContent";

interface TAppointmentNotesCreateDialogProps {
  patientId: string;
  appointmentId: string;
  onClose: () => void;
}

function AppointmentNotesCreateDialog({
  patientId,
  appointmentId,
  onClose,
}: TAppointmentNotesCreateDialogProps) {
  const { mutateAsync } = useCreateAppointmentNotes();

  const { submitForm, ...form } = useAppointmentNotesForm({
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          patientId,
          appointmentId,
          notes: { ...values, appointmentId },
        });
        onClose();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  return (
    <AppointmentNotesDialogContent
      title="Add notes"
      form={form}
      submitForm={submitForm}
    />
  );
}

export { AppointmentNotesCreateDialog };
