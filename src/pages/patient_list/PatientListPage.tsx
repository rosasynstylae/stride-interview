import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { PatientListHeaderBar } from "./PatientListHeaderBar";
import { PatientListContainer } from "./PatientListContainer";
import { Flex } from "@chakra-ui/react/flex";
import { PatientCreateDialog } from "./PatientCreateContainer";

function PatientListPage() {
  return (
    <PageLayout
      title={getPageTitle("Patients")}
      headerBar={<PatientListHeaderBar />}
    >
      <Flex direction="column" w="full">
        <Flex alignSelf="end">
          <PatientCreateDialog />
        </Flex>
        <PatientListContainer />
      </Flex>
    </PageLayout>
  );
}

export default PatientListPage;
