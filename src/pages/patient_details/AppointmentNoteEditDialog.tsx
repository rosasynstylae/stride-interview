import { IconButton } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { Portal } from "@chakra-ui/react/portal";
import { LuPencil } from "react-icons/lu";
import { useUpdateAppointmentNotes } from "@/api/appointment_notes/updateAppointmentNotes";
import { useAppointmentNotesForm } from "@/components/appointment_notes/useAppointmentNotesForm";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import { useOpen } from "@/utils/useOpen";
import { AppointmentNoteDialogContent } from "./AppointmentNoteDialogContent";

interface TAppointmentNoteEditFormProps {
  patientId: string;
  note: TAppointmentNotes;
  onClose: () => void;
}

/** Mounted only while the dialog is open, so it always starts from the latest note */
function AppointmentNoteEditForm({ patientId, note, onClose }: TAppointmentNoteEditFormProps) {
  const { mutateAsync } = useUpdateAppointmentNotes();

  const { submitForm, ...form } = useAppointmentNotesForm({
    defaultValues: {
      chiefComplaint: note.chiefComplaint,
      treatmentPlan: note.treatmentPlan,
      progress: note.progress,
    },
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          patientId,
          appointmentId: note.appointmentId,
          notesId: note.id,
          notes: { ...values, appointmentId: note.appointmentId },
        });
        onClose();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  return <AppointmentNoteDialogContent title="Edit note" form={form} submitForm={submitForm} />;
}

interface TAppointmentNoteEditDialogProps {
  patientId: string;
  note: TAppointmentNotes;
  /** The note's heading, e.g. "Note 1 · Jan 30, 2025"; makes the button's label specific */
  title: string;
}

function AppointmentNoteEditDialog({ patientId, note, title }: TAppointmentNoteEditDialogProps) {
  const { open, setOpen, onClose } = useOpen();

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} lazyMount unmountOnExit>
      <Dialog.Trigger asChild>
        <IconButton size="xs" variant="ghost" aria-label={`Edit ${title}`}>
          <LuPencil />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <AppointmentNoteEditForm patientId={patientId} note={note} onClose={onClose} />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export { AppointmentNoteEditDialog };
