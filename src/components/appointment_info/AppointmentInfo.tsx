import { Badge } from "@chakra-ui/react/badge";
import { DataList } from "@chakra-ui/react/data-list";
import { chakra } from "@chakra-ui/react/styled-system";
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
        {/* DataList values are flex rows that don't wrap; let the date and the time
            range wrap apart on narrow screens, keeping "start – end" on one line */}
        <DataList.ItemValue flexWrap="wrap" columnGap={1}>
          <span>{formatDate(appointment.startTime)},</span>{" "}
          <chakra.span whiteSpace="nowrap">
            <time dateTime={appointment.startTime}>
              {formatTime(appointment.startTime)}
            </time>
            {" – "}
            <time dateTime={appointment.endTime}>
              {formatTime(appointment.endTime)}
            </time>
          </chakra.span>
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
