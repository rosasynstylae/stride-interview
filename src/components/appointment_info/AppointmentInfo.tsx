import { Badge } from "@chakra-ui/react/badge";
import { DataList } from "@chakra-ui/react/data-list";
import { APPOINTMENT_STATUS_COLORS } from "@/utils/appointmentStatusColors";
import { formatDate, formatTime } from "@/utils/formatDate";
import type { TAppointment } from "@/utils/types/appointment";

interface TAppointmentInfoProps {
  appointment: TAppointment;
  providerName: string;
}

function AppointmentInfo({ appointment, providerName }: TAppointmentInfoProps) {
  return (
    <DataList.Root orientation="horizontal">
      <DataList.Item>
        <DataList.ItemLabel>Date &amp; time</DataList.ItemLabel>
        <DataList.ItemValue>
          <time dateTime={appointment.startTime}>
            {formatDate(appointment.startTime)}, {formatTime(appointment.startTime)}
          </time>
          {" – "}
          <time dateTime={appointment.endTime}>
            {formatTime(appointment.endTime)}
          </time>
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Type</DataList.ItemLabel>
        <DataList.ItemValue>{appointment.type}</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Status</DataList.ItemLabel>
        <DataList.ItemValue>
          <Badge colorPalette={APPOINTMENT_STATUS_COLORS[appointment.status] ?? "gray"}>
            {appointment.status}
          </Badge>
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Provider</DataList.ItemLabel>
        <DataList.ItemValue>{providerName}</DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

export { AppointmentInfo };
