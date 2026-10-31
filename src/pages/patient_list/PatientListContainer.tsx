import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { PatientList } from "@/components/patient_list/PatientList";
import { Text } from "@chakra-ui/react/text";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function PatientListContainer() {
  const { data, isFetching, isError } = useFetchPatientList();

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (!data || isError) {
    return <Text>There was an issue. Please refresh and try again.</Text>;
  }

  return <PatientList patients={data} />;
}

export { PatientListContainer };
