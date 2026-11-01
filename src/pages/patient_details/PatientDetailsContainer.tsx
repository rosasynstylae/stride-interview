import { APIError } from "@/api/api";
import { useFetchPatient } from "@/api/patient/fetchPatient";
import { useFetchPatientAppointmentList } from "@/api/patient/fetchPatientAppointmentList";
import { useFetchProviderList } from "@/api/provider/fetchProviderList";
import { PatientInfo } from "@/components/patient_info/PatientInfo";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Flex } from "@chakra-ui/react/flex";
import { Text } from "@chakra-ui/react/text";
import { AppointmentsListContainer } from "./AppointmentsListContainer";
import { Heading } from "@chakra-ui/react/heading";

interface TPatientDetailsContainerProps {
  id: string;
}

function PatientNotFound() {
  return (
    <Flex direction="column" alignItems="center" w="full">
      <Heading as="h1" size="7xl">
        404
      </Heading>
      <Text fontSize="3xl">Patient not found.</Text>
    </Flex>
  );
}

function PatientDetailsContainer({ id }: TPatientDetailsContainerProps) {
  // All queries start immediately and run in parallel
  const patient = useFetchPatient(id);
  const appointments = useFetchPatientAppointmentList(id);
  const providers = useFetchProviderList();

  if (patient.isPending) return <LoadingSpinner />;

  if (patient.isError) {
    if (patient.error instanceof APIError && patient.error.status === 404) {
      return <PatientNotFound />;
    }
    return <Text>There was an issue. Please refresh and try again.</Text>;
  }

  return (
    // minW={0}: as a child of <main>'s flex row this would otherwise refuse to
    // shrink below the table's width, so the page would widen instead of the table scrolling
    <Flex direction="column" gap={8} w="full" minW={0}>
      <PatientInfo patient={patient.data} />
      <AppointmentsListContainer
        patientId={id}
        appointments={appointments.data ?? []}
        providers={providers.data ?? []}
        /* Wait for providers too, so names don't pop in after "Provider #ID" */
        isPending={appointments.isPending || providers.isPending}
        // Provider names are a nice-to-have: on error, rows fall back to "Provider #ID", so only need the appointments error
        isError={appointments.isError}
      />
    </Flex>
  );
}

export { PatientDetailsContainer, PatientNotFound };
