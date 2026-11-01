import { Text } from "@chakra-ui/react/text";
import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { useFetchProviderList } from "@/api/provider/fetchProviderList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AppointmentCreateFormContainer } from "./AppointmentCreateFormContainer";

function AppointmentCreationContainer() {
  // Both queries start immediately and run in parallel
  const providers = useFetchProviderList();
  const patients = useFetchPatientList();

  if (providers.isPending || patients.isPending) return <LoadingSpinner />;

  if (providers.isError || patients.isError) {
    return (
      <Text>
        There was an issue loading patients and providers. Please refresh and
        try again.
      </Text>
    );
  }

  return (
    <AppointmentCreateFormContainer
      providers={providers.data}
      patients={patients.data}
    />
  );
}

export { AppointmentCreationContainer };
