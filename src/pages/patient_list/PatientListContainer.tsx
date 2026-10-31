import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { Spinner } from "@chakra-ui/react/spinner";
import { PatientList } from "@/components/patient_list/PatientList";
import { Flex } from "@chakra-ui/react/flex";
import { Text } from "@chakra-ui/react/text";

function PatientListContainer() {
  const { data, isFetching, isError } = useFetchPatientList();

  if (isFetching) {
    return (
      <Flex w="full" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!data || isError) {
    return <Text>There was an issue. Please refresh and try again.</Text>;
  }

  return <PatientList patients={data} />;
}

export { PatientListContainer };
