import { Button } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { Portal } from "@chakra-ui/react/portal";
import { useCreateAppointmentNotes } from "@/api/appointment_notes/createAppointmentNotes";
import { useAppointmentNotesForm } from "@/components/appointment_notes/useAppointmentNotesForm";
import { useOpen } from "@/utils/useOpen";
import { AppointmentNoteDialogContent } from "./AppointmentNoteDialogContent";

interface TAppointmentNoteCreateFormProps {
  patientId: string;
  appointmentId: string;
  onClose: () => void;
}

/** Mounted only while the dialog is open, so each open starts blank */
function AppointmentNoteCreateForm({
  patientId,
  appointmentId,
  onClose,
}: TAppointmentNoteCreateFormProps) {
  const { mutateAsync } = useCreateAppointmentNotes();

  const { submitForm, ...form } = useAppointmentNotesForm({
    onSubmit: async (values) => {
      try {
        // Resolves once the notes list has refetched, so the new note is listed on close
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

  return <AppointmentNoteDialogContent title="Add note" form={form} submitForm={submitForm} />;
}

interface TAppointmentNoteCreateDialogProps {
  patientId: string;
  appointmentId: string;
}

function AppointmentNoteCreateDialog({ patientId, appointmentId }: TAppointmentNoteCreateDialogProps) {
  const { open, setOpen, onClose } = useOpen();

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} lazyMount unmountOnExit>
      <Dialog.Trigger asChild>
        <Button size="sm">Add note</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <AppointmentNoteCreateForm
            patientId={patientId}
            appointmentId={appointmentId}
            onClose={onClose}
          />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export { AppointmentNoteCreateDialog };
