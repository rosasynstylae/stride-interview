import { Heading } from "@chakra-ui/react/heading";
import { Card } from "@chakra-ui/react/card";
import { Flex } from "@chakra-ui/react/flex";
import { QuickLinkCard } from "./QuickLinkCard";

function QuickLinks() {
  return (
    <Flex direction="column" gap={2} w="full">
      <Heading size="xl">Quick Links</Heading>
      <Flex
        direction="row"
        gap={2}
        flexWrap="wrap"
        justify={{ base: "center", md: "flex-start" }}
        w="full"
      >
        <QuickLinkCard link="/patients">
          <Card.Title mb="2">Patient List</Card.Title>
          <Card.Description>See the list of patients</Card.Description>
        </QuickLinkCard>
        <QuickLinkCard link="/appointments">
          <Card.Title mb="2">Appointment List</Card.Title>
          <Card.Description>See the list of appointments</Card.Description>
        </QuickLinkCard>
      </Flex>
    </Flex>
  );
}

export { QuickLinks };
