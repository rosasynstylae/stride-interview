import { useId } from "react";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { APPOINTMENT_STATUS_COLORS } from "@/utils/appointmentStatusColors";
import { formatDate, formatTime } from "@/utils/formatDate";
import { getProviderName } from "@/utils/getProviderName";
import { Badge } from "@chakra-ui/react/badge";
import { Flex } from "@chakra-ui/react/flex";
import { Table } from "@chakra-ui/react/table";
import { Text } from "@chakra-ui/react/text";
import { ActionHeading } from "../ActionHeading";

interface TAppointmentListProps {
  appointments: TAppointment[];
  providers: TProvider[];
  headerAction?: React.ReactNode;
  // would be better, long-term, to extract the table row
  // with a prop that can pass in the date cell.
  // Then have the table wrapper take in "children" that is a list of the rows
  // *then* put that all together in a container.
  // That's easier to test and handles components more naturally.
  // This was faster.
  /** Replaces the plain date in the Date column (e.g. with a control that opens details) */
  renderDateCell?: (appointment: TAppointment) => React.ReactNode;
}

const PlainDate = ({ appointment }: { appointment: TAppointment }) => (
  <time dateTime={appointment.startTime}>
    {formatDate(appointment.startTime)}
  </time>
);

function AppointmentList({
  appointments,
  providers,
  headerAction,
  renderDateCell,
}: TAppointmentListProps) {
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
          <Table.Body>
            {appointments.length ? (
              appointments.map((a) => (
                <Table.Row key={a.id}>
                  <Table.Cell>
                    {renderDateCell ? (
                      renderDateCell(a)
                    ) : (
                      <PlainDate appointment={a} />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <time dateTime={a.startTime}>
                      {formatTime(a.startTime)}
                    </time>
                    {" – "}
                    <time dateTime={a.endTime}>{formatTime(a.endTime)}</time>
                  </Table.Cell>
                  <Table.Cell>{a.type}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        APPOINTMENT_STATUS_COLORS[a.status] ?? "gray"
                      }
                    >
                      {a.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {getProviderName(providers, a.providerId)}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center">
                  <Text fontSize="lg">No Appointments Found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Flex>
  );
}

export { AppointmentList };
