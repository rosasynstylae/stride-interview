import { useId } from "react";
import { Flex } from "@chakra-ui/react/flex";
import { Table } from "@chakra-ui/react/table";
import { ActionHeading } from "../ActionHeading";

interface TAppointmentListProps {
  headerAction?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
}

function AppointmentList({ headerAction, children }: TAppointmentListProps) {
  const headingId = useId();

  return (
    <Flex direction="column" gap={2} w="full">
      <ActionHeading
        title="Appointments"
        headingId={headingId}
        headingLevel="h2"
        size="lg"
        headerAction={headerAction}
        align="center"
        gap={2}
      />
      {/* Scrolls sideways on narrow screens. Focusable + labelled so keyboard
          users can scroll it too (a scrollable region needs to be reachable) */}
      <Table.ScrollArea
        tabIndex={0}
        role="region"
        aria-labelledby={headingId}
        focusRing="outside"
      >
        <Table.Root aria-labelledby={headingId}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Time</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Provider</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>{children}</Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Flex>
  );
}

export { AppointmentList };
