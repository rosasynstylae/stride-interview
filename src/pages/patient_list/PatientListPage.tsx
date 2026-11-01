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
      {/* minW={0}: as a child of <main>'s flex row this would otherwise refuse to
          shrink below the table's width, so the page would widen instead of the table scrolling */}
      <Flex direction="column" w="full" minW={0}>
        <Flex alignSelf="end">
          <PatientCreateDialog />
        </Flex>
        <PatientListContainer />
      </Flex>
    </PageLayout>
  );
}

export default PatientListPage;
