import { useEffect, useMemo } from "react";
import { Button } from "@chakra-ui/react/button";
import { Flex } from "@chakra-ui/react/flex";
import { FormProvider } from "react-hook-form";
import { useUpdatePatientAppointment } from "@/api/patient/updatePatientAppointment";
import { AppointmentForm } from "@/components/appointment_form/AppointmentForm";
import { toAppointmentFormValues } from "@/components/appointment_form/toAppointmentFormValues";
import { useAppointmentForm } from "@/components/appointment_form/useAppointmentForm";
import { toProviderOptions } from "@/utils/selectOptions";
import { toAppointmentInstants } from "@/components/appointment_form/toAppointmentInstants";
import type { TAppointment } from "@/utils/types/appointment";
import type { TProvider } from "@/utils/types/provider";

interface TAppointmentEditContainerProps {
  appointment: TAppointment;
  providers: TProvider[];
  onCancel: () => void;
  onSuccess?: () => void;
}

function AppointmentEditContainer({
  appointment,
  providers,
  onCancel,
  onSuccess,
}: TAppointmentEditContainerProps) {
  const { mutateAsync } = useUpdatePatientAppointment();

  const { submitForm, ...form } = useAppointmentForm({
    defaultValues: toAppointmentFormValues(appointment),
    onSubmit: async ({ startDate, startTime, endDate, endTime, ...rest }) => {
      try {
        await mutateAsync({
          patientId: appointment.patientId,
          appointmentId: appointment.id,
          appointmentInfo: {
            ...rest,
            patientId: appointment.patientId,
            ...toAppointmentInstants({ startDate, startTime, endDate, endTime }),
          },
        });
        onSuccess?.();
      } catch {
        // The mutation's onError shows a toast; keep the form open with the values intact
      }
    },
  });

  const { setFocus } = form;

  // The Edit button that opened this is gone, so move focus into the form
  useEffect(() => {
    setFocus("startDate");
  }, [setFocus]);

  const { isSubmitting } = form.formState;

  // Always includes the appointment's provider, even before the list loads or if it failed
  const providerOptions = useMemo(
    () => toProviderOptions(providers, appointment.providerId),
    [providers, appointment.providerId],
  );

  return (
    <FormProvider {...form}>
      <form
        aria-label="Edit appointment"
        onSubmit={(e) => void submitForm(e)}
        noValidate
      >
        <Flex direction="column" gap={4}>
          <AppointmentForm providers={providerOptions} />
          <Flex gap={3} justifyContent="flex-end">
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
}

export { AppointmentEditContainer };
