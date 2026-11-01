import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { useFetchProviderList } from "@/api/provider/fetchProviderList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AppointmentCreateFormContainer } from "./AppointmentCreateFormContainer";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

function AppointmentCreationContainer() {
  // Both queries start immediately and run in parallel
  const providers = useFetchProviderList();
  const patients = useFetchPatientList();

  if (providers.isPending || patients.isPending) {
    return <LoadingSpinner label="Loading patient information" />;
  }

  if (providers.isError || patients.isError) {
    // The page already has its "New appointment" h1
    return <ErrorAlert headingLevel={2} />;
  }

  return (
    <AppointmentCreateFormContainer
      providers={providers.data}
      patients={patients.data}
    />
  );
}

export { AppointmentCreationContainer };
