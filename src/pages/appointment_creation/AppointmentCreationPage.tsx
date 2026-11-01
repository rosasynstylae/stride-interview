import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";
import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { AppointmentCreationContainer } from "./AppointmentCreationContainer";
import { AppointmentCreationHeaderBar } from "./AppointmentCreationHeaderBar";

function AppointmentCreationPage() {
  return (
    <PageLayout
      title={getPageTitle("New Appointment")}
      headerBar={<AppointmentCreationHeaderBar />}
    >
      <Flex direction="column" gap={6} w="full">
        <Heading as="h1" size="2xl">
          New appointment
        </Heading>
        <AppointmentCreationContainer />
      </Flex>
    </PageLayout>
  );
}

export default AppointmentCreationPage;
