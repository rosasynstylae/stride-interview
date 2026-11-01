import { AppointmentList } from "@/components/appointment_list/AppointmentList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { sortAppointments } from "@/utils/sortAppointments";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { Text } from "@chakra-ui/react/text";
import { AppointmentCreateDialog } from "./AppointmentCreateDialog";
import { AppointmentDetailsDrawer } from "@/pages/patient_details/AppointmentDetailsDrawer";

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
    <AppointmentList
      appointments={sortedApts}
      providers={providers}
      headerAction={
        <AppointmentCreateDialog patientId={patientId} providers={providers} />
      }
      renderDateCell={(appointment) => (
        <AppointmentDetailsDrawer patientId={patientId} appointment={appointment} />
      )}
    />
  );
}

export { AppointmentsListContainer };
