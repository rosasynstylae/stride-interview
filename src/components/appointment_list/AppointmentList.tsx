import { useId } from "react";
import type {
  TAppointment,
  TAppointmentStatus,
} from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { formatDate, formatTime } from "@/utils/formatDate";
import { getProviderById } from "@/utils/getProviderById";
import { Badge } from "@chakra-ui/react/badge";
import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";
import { Table } from "@chakra-ui/react/table";
import { Text } from "@chakra-ui/react/text";
import { VisuallyHidden } from "@chakra-ui/react/visually-hidden";

interface TAppointmentListProps {
  appointments: TAppointment[];
  providers: TProvider[];
  headerAction?: React.ReactNode;
  /** Rendered in an extra, visually unlabelled column at the end of each row */
  renderRowAction?: (appointment: TAppointment) => React.ReactNode;
}

const STATUS_COLORS: Record<TAppointmentStatus, string> = {
  Scheduled: "blue",
  "Checked In": "green",
  Cancelled: "red",
};

const getProviderName = (providers: TProvider[], id: string): string => {
  const provider = getProviderById(providers, id);
  return provider
    ? `${provider.firstName} ${provider.lastName}`
    : `Provider #${id}`;
};

function AppointmentList({
  appointments,
  providers,
  headerAction,
  renderRowAction,
}: TAppointmentListProps) {
  const headingId = useId();
  const columnCount = renderRowAction ? 6 : 5;

  return (
    <Flex direction="column" gap={2} w="full">
      <Flex justify="space-between" align="center" gap={2}>
        <Heading as="h2" size="lg" id={headingId}>
          Appointments
        </Heading>
        {headerAction}
      </Flex>
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
              {renderRowAction && (
                // No visible header, but screen readers still need a column name
                <Table.ColumnHeader>
                  <VisuallyHidden>Notes</VisuallyHidden>
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {appointments.length ? (
              appointments.map((a) => (
                <Table.Row key={a.id}>
                  <Table.Cell>
                    <time dateTime={a.startTime}>{formatDate(a.startTime)}</time>
                  </Table.Cell>
                  <Table.Cell>
                    <time dateTime={a.startTime}>{formatTime(a.startTime)}</time>
                    {" – "}
                    <time dateTime={a.endTime}>{formatTime(a.endTime)}</time>
                  </Table.Cell>
                  <Table.Cell>{a.type}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLORS[a.status] ?? "gray"}>
                      {a.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {getProviderName(providers, a.providerId)}
                  </Table.Cell>
                  {renderRowAction && (
                    <Table.Cell textAlign="end">{renderRowAction(a)}</Table.Cell>
                  )}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columnCount} textAlign="center">
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
