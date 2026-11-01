import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { PatientList } from "@/components/patient_list/PatientList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Flex } from "@chakra-ui/react/flex";
import { PatientCreateDialog } from "./PatientCreateContainer";

function PatientListContainer() {
  const { data, isFetching, isError } = useFetchPatientList();

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (!data || isError) {
    return <ErrorAlert />;
  }

  return (
    <>
      <Flex alignSelf="end">
        <PatientCreateDialog />
      </Flex>
      <PatientList patients={data} />
    </>
  );
}

export { PatientListContainer };
