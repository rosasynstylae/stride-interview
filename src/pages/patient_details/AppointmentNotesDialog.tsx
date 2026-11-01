import { IconButton } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { Portal } from "@chakra-ui/react/portal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Text } from "@chakra-ui/react/text";
import { useFetchAppointmentNotesList } from "@/api/appointment_notes/fetchAppointmentNotesList";
import { formatDate } from "@/utils/formatDate";
import type { TAppointment } from "@/utils/types/appointment";
import { useOpen } from "@/utils/useOpen";
import { AppointmentNotesCreateDialog } from "./AppointmentNotesCreateDialog";
import { AppointmentNotesEditDialog } from "./AppointmentNotesEditDialog";
import { LuPencil } from "react-icons/lu";

interface TAppointmentNotesDialogProps {
  patientId: string;
  appointment: TAppointment;
}

function AppointmentNotesDialog({
  patientId,
  appointment,
}: TAppointmentNotesDialogProps) {
  const { open, setOpen, onClose } = useOpen();
  const { data, isPending, isError } = useFetchAppointmentNotesList(
    patientId,
    appointment.id,
  );

  if (isPending) return <LoadingSpinner size="sm" label="Loading notes" />;

  // decided to always show error if an endpoint errors,
  // as if the issue is a network blip, a refresh will fix.
  // if the error is bigger than a network blip, we should show
  // the error
  if (isError) {
    return (
      <Text textStyle="sm" color="fg.muted">
        Notes unavailable
      </Text>
    );
  }

  // One notes record per appointment in practice; undefined when there are none
  const notes = data.at(0);
  const action = notes ? "Edit notes" : "Add notes";

  return (
    // The trigger stays mounted when the content swaps from create to edit, so focus
    // returns to it on close. lazyMount + unmountOnExit remount the form each open.
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      lazyMount
      unmountOnExit
    >
      <Dialog.Trigger asChild>
        <IconButton
          size="xs"
          variant="outline"
          // Every row has one of these; say which appointment it's for
          aria-label={`${action} for ${formatDate(appointment.startTime)} appointment`}
        >
          <LuPencil />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          {notes ? (
            <AppointmentNotesEditDialog
              patientId={patientId}
              notes={notes}
              onClose={onClose}
            />
          ) : (
            <AppointmentNotesCreateDialog
              patientId={patientId}
              appointmentId={appointment.id}
              onClose={onClose}
            />
          )}
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export { AppointmentNotesDialog };
