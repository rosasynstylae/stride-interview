import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { APPOINTMENT_STATUS_COLORS } from "@/utils/appointmentStatusColors";
import { formatDate, formatTime } from "@/utils/formatDate";
import { getProviderName } from "@/utils/getProviderName";
import { Badge } from "@chakra-ui/react/badge";
import { Table } from "@chakra-ui/react/table";

interface TAppointmentListProps {
  appointment: TAppointment;
  providers: TProvider[];
  dateCell?: React.ReactNode;
}

const PlainDate = ({ appointment }: { appointment: TAppointment }) => (
  <time dateTime={appointment.startTime}>
    {formatDate(appointment.startTime)}
  </time>
);

function AppointmentListRow({
  appointment,
  providers,
  dateCell,
}: TAppointmentListProps) {
  return (
    <Table.Row>
      <Table.Cell>
        {dateCell ? dateCell : <PlainDate appointment={appointment} />}
      </Table.Cell>
      <Table.Cell>
        <time dateTime={appointment.startTime}>
          {formatTime(appointment.startTime)}
        </time>
        {" – "}
        <time dateTime={appointment.endTime}>
          {formatTime(appointment.endTime)}
        </time>
      </Table.Cell>
      <Table.Cell>{appointment.type}</Table.Cell>
      <Table.Cell>
        <Badge
          colorPalette={APPOINTMENT_STATUS_COLORS[appointment.status] ?? "gray"}
        >
          {appointment.status}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        {getProviderName(providers, appointment.providerId)}
      </Table.Cell>
    </Table.Row>
  );
}

export { AppointmentListRow };
