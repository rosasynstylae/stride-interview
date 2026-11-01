import { useId } from "react";
import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";
import { Separator } from "@chakra-ui/react/separator";
import { chakra } from "@chakra-ui/react/styled-system";
import { Text } from "@chakra-ui/react/text";
import { APIError } from "@/api/api";
import { useFetchAppointmentNotesList } from "@/api/appointment_notes/fetchAppointmentNotesList";
import { useFetchPatientAppointment } from "@/api/patient/fetchPatientAppointment";
import { useFetchProviderList } from "@/api/provider/fetchProviderList";
import { AppointmentInfoContainer } from "./AppointmentInfoContainer";
import { AppointmentNote } from "@/components/appointment_note/AppointmentNote";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/formatDate";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import { AppointmentNoteCreateDialog } from "./AppointmentNoteCreateDialog";
import { AppointmentNoteEditDialog } from "./AppointmentNoteEditDialog";

interface TAppointmentDetailsContainerProps {
  patientId: string;
  appointmentId: string;
}

interface TNotesListProps {
  patientId: string;
  notes: TAppointmentNotes[] | undefined;
  isPending: boolean;
  isError: boolean;
}

function NotesList({ patientId, notes, isPending, isError }: TNotesListProps) {
  if (isPending) return <LoadingSpinner size="sm" label="Loading notes" />;
  if (isError || !notes) {
    return <ErrorAlert headingLevel={3} />;
  }
  if (!notes.length) return <Text color="fg.muted">No notes yet.</Text>;

  const sorted = notes.toSorted((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );

  return (
    <Flex direction="column" gap={6}>
      {sorted.map((note, index) => {
        const title = `Note ${index + 1} · ${formatDate(note.createdAt)}`;
        return (
          <Flex key={note.id} direction="column" gap={6}>
            {index > 0 && <Separator />}
            <AppointmentNote
              note={note}
              title={title}
              headerAction={
                <AppointmentNoteEditDialog
                  patientId={patientId}
                  note={note}
                  title={title}
                />
              }
            />
          </Flex>
        );
      })}
    </Flex>
  );
}

function AppointmentDetailsContainer({
  patientId,
  appointmentId,
}: TAppointmentDetailsContainerProps) {
  const notesHeadingId = useId();

  // All queries start immediately and run in parallel
  const appointment = useFetchPatientAppointment(patientId, appointmentId);
  const notes = useFetchAppointmentNotesList(patientId, appointmentId);
  const providers = useFetchProviderList();

  if (appointment.isPending)
    return <LoadingSpinner label="Loading appointment" />;

  if (appointment.isError) {
    if (
      appointment.error instanceof APIError &&
      appointment.error.status === 404
    ) {
      return <Text>Appointment not found.</Text>;
    }
    // The drawer title is the h2 here
    return <ErrorAlert headingLevel={3} />;
  }

  return (
    <Flex direction="column" gap={8}>
      <AppointmentInfoContainer
        appointment={appointment.data}
        providers={providers.data ?? []}
      />
      <chakra.section aria-labelledby={notesHeadingId}>
        <Flex align="center" justify="space-between" gap={2} mb={4}>
          <Heading as="h2" size="lg" id={notesHeadingId}>
            Notes
          </Heading>
          <AppointmentNoteCreateDialog
            patientId={patientId}
            appointmentId={appointmentId}
          />
        </Flex>
        <NotesList
          patientId={patientId}
          notes={notes.data}
          isPending={notes.isPending}
          isError={notes.isError}
        />
      </chakra.section>
    </Flex>
  );
}

export { AppointmentDetailsContainer };
