import { Button } from "@chakra-ui/react/button";
import { Flex } from "@chakra-ui/react/flex";
import { AppointmentInfo } from "@/components/appointment_info/AppointmentInfo";
import { getProviderName } from "@/utils/getProviderName";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";
import { useInlineEditToggle } from "@/utils/useInlineEditToggle";
import { AppointmentEditContainer } from "./AppointmentEditContainer";

interface TAppointmentInfoContainerProps {
  appointment: TAppointment;
  providers: TProvider[];
}

function AppointmentInfoContainer({
  appointment,
  providers,
}: TAppointmentInfoContainerProps) {
  // Swaps view ↔ form, returning focus to the Edit button when the form closes
  const { open, onOpen, closeForm, triggerRef: editButtonRef } = useInlineEditToggle();

  if (open) {
    return (
      <AppointmentEditContainer
        appointment={appointment}
        providers={providers}
        onCancel={closeForm}
        onSuccess={closeForm}
      />
    );
  }

  return (
    <Flex direction="column" gap={4}>
      <AppointmentInfo
        appointment={appointment}
        // Provider name is a nice-to-have: falls back to "Provider #ID" while loading or on error
        providerName={getProviderName(providers, appointment.providerId)}
      />
      <Button
        ref={editButtonRef}
        onClick={onOpen}
        variant="outline"
        size="sm"
        alignSelf="flex-end"
      >
        Edit appointment
      </Button>
    </Flex>
  );
}

export { AppointmentInfoContainer };
