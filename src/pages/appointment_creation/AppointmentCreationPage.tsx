import { Flex } from "@chakra-ui/react/flex";
import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { AppointmentCreationContainer } from "./AppointmentCreationContainer";
import { AppointmentCreationHeaderBar } from "./AppointmentCreationHeaderBar";
import { PageHeader } from "@/components/PageHeader";

function AppointmentCreationPage() {
  return (
    <PageLayout
      title={getPageTitle("New Appointment")}
      headerBar={<AppointmentCreationHeaderBar />}
    >
      <Flex direction="column" gap={6} w="full">
        <PageHeader title="New appointment" />
        <AppointmentCreationContainer />
      </Flex>
    </PageLayout>
  );
}

export default AppointmentCreationPage;
