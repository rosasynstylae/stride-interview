import { AppointmentList } from "@/components/appointment_list/AppointmentList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { sortAppointments } from "@/utils/sortAppointments";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { Text } from "@chakra-ui/react/text";
import { AppointmentCreateDialog } from "./AppointmentCreateDialog";
import { AppointmentDetailsDrawer } from "@/pages/patient_details/AppointmentDetailsDrawer";
import { AppointmentListRow } from "@/components/appointment_list/AppointmentListRow";
import { AppointmentListEmptyRow } from "@/components/appointment_list/AppointmentListEmptyRow";

interface TAppointmentListDisplay {
  patientId: string;
  appointments: TAppointment[];
  providers: TProvider[];
}

function AppointmentListDisplay({
  patientId,
  appointments,
  providers,
}: TAppointmentListDisplay) {
  return (
    <AppointmentList
      headerAction={
        <AppointmentCreateDialog patientId={patientId} providers={providers} />
      }
    >
      {appointments.length ? (
        appointments.map((a) => (
          <AppointmentListRow
            key={a.id}
            appointment={a}
            providers={providers}
            dateCell={
              <AppointmentDetailsDrawer patientId={patientId} appointment={a} />
            }
          />
        ))
      ) : (
        <AppointmentListEmptyRow />
      )}
    </AppointmentList>
  );
}

interface TAppointmentsListContainerProps {
  patientId: string;
  appointments: TAppointment[];
  providers: TProvider[];
  isError: boolean;
  isPending: boolean;
}

function AppointmentsListContainer({
  patientId,
  appointments,
  providers,
  isError,
  isPending,
}: TAppointmentsListContainerProps) {
  if (isPending) {
    return <LoadingSpinner label="Loading appointment information" />;
  }

  if (isError) {
    return (
      <Text>
        There was an issue loading appointments. Please refresh and try again.
      </Text>
    );
  }

  const sortedApts = sortAppointments(appointments);

  return (
    <AppointmentListDisplay
      patientId={patientId}
      appointments={sortedApts}
      providers={providers}
    />
  );
}

export { AppointmentsListContainer };
