import { Button, CloseButton } from "@chakra-ui/react/button";
import { Drawer } from "@chakra-ui/react/drawer";
import { Icon } from "@chakra-ui/react/icon";
import { Portal } from "@chakra-ui/react/portal";
import { VisuallyHidden } from "@chakra-ui/react/visually-hidden";
import { LuEye } from "react-icons/lu";
import { formatDate, formatTime } from "@/utils/formatDate";
import type { TAppointment } from "@/utils/types/appointment";
import { useOpen } from "@/utils/useOpen";
import { AppointmentDetailsContainer } from "./AppointmentDetailsContainer";

interface TAppointmentDetailsDrawerProps {
  patientId: string;
  appointment: TAppointment;
}

/** The appointments table's date cell: opens the appointment's details and notes */
function AppointmentDetailsDrawer({
  patientId,
  appointment,
}: TAppointmentDetailsDrawerProps) {
  const { open, setOpen } = useOpen();
  const date = formatDate(appointment.startTime);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement="end"
      size="lg"
      lazyMount
      unmountOnExit
    >
      <Drawer.Trigger asChild>
        <Button variant="plain" px={0} h="auto" gap={2} fontWeight="normal">
          <Icon aria-hidden>
            <LuEye />
          </Icon>
          <VisuallyHidden>View appointment on </VisuallyHidden>
          <time dateTime={appointment.startTime}>{date}</time>
          <VisuallyHidden>
            {" "}
            at {formatTime(appointment.startTime)} to{" "}
            {formatTime(appointment.endTime)}
          </VisuallyHidden>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Appointment · {date}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <AppointmentDetailsContainer
                patientId={patientId}
                appointmentId={appointment.id}
              />
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

export { AppointmentDetailsDrawer };
