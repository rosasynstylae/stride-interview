import { Button, CloseButton } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { Portal } from "@chakra-ui/react/portal";
import { useCreatePatientAppointment } from "@/api/patient/createPatientAppointment";
import { AppointmentForm } from "@/components/appointment_form/AppointmentForm";
import { useAppointmentForm } from "@/components/appointment_form/useAppointmentForm";
import type { TProvider } from "@/utils/types/provider";
import { useOpen } from "@/utils/useOpen";
import { toISODateTime } from "@/utils/toISODateTime";
import { toProviderOption } from "@/utils/selectOptions";
import { useMemo } from "react";
import { FormProvider } from "react-hook-form";

interface TAppointmentCreateDialogProps {
  patientId: string;
  providers: TProvider[];
}

function AppointmentCreateDialog({
  patientId,
  providers,
}: TAppointmentCreateDialogProps) {
  const { open, setOpen, onClose } = useOpen();
  const { mutateAsync } = useCreatePatientAppointment();

  const { submitForm, ...form } = useAppointmentForm({
    onSubmit: async ({ date, startTime, endTime, ...rest }) => {
      try {
        await mutateAsync({
          ...rest,
          patientId,
          startTime: toISODateTime(date, startTime),
          endTime: toISODateTime(date, endTime),
        });
        onClose();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  const {
    reset,
    formState: { isValid, isDirty, isSubmitting },
  } = form;

  const providerOptions = useMemo(
    () => providers.map(toProviderOption),
    [providers],
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onExitComplete={() => reset()}
    >
      <Dialog.Trigger asChild>
        <Button size="sm">Add appointment</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          {/* Content renders as the <form> so Body/Footer keep the dialog's layout */}
          <FormProvider {...form}>
            <Dialog.Content asChild>
              <form onSubmit={(e) => void submitForm(e)} noValidate>
                <Dialog.Header>
                  <Dialog.Title>Add appointment</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <AppointmentForm providers={providerOptions} />
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button
                    type="submit"
                    disabled={!isValid || !isDirty}
                    loading={isSubmitting}
                  >
                    Save
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </form>
            </Dialog.Content>
          </FormProvider>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export { AppointmentCreateDialog };
