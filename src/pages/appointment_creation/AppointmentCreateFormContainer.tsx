import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "@chakra-ui/react/button";
import { Flex } from "@chakra-ui/react/flex";
import { useCreatePatientAppointment } from "@/api/patient/createPatientAppointment";
import { AppointmentFormPatient } from "@/components/appointment_form/AppointmentFormPatient";
import { useAppointmentFormPatient } from "@/components/appointment_form/useAppointmentFormPatient";
import { toPatientOption, toProviderOption } from "@/utils/selectOptions";
import { toISODateTime } from "@/utils/toISODateTime";
import type { TPatient } from "@/utils/types/patient";
import type { TProvider } from "@/utils/types/provider";
import { FormProvider } from "react-hook-form";

interface TAppointmentCreateFormContainerProps {
  providers: TProvider[];
  patients: TPatient[];
}

function AppointmentCreateFormContainer({
  providers,
  patients,
}: TAppointmentCreateFormContainerProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useCreatePatientAppointment();

  const { submitForm, ...form } = useAppointmentFormPatient({
    onSubmit: async ({ date, startTime, endTime, patientId, ...rest }) => {
      try {
        await mutateAsync({
          ...rest,
          patientId,
          startTime: toISODateTime(date, startTime),
          endTime: toISODateTime(date, endTime),
        });
        await navigate(`/patients/${patientId}`);
      } catch {
        // The mutation's onError shows a toast; stay on the page with the values intact
      }
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const patientOptions = useMemo(
    () => patients.map(toPatientOption),
    [patients],
  );
  const providerOptions = useMemo(
    () => providers.map(toProviderOption),
    [providers],
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => void submitForm(e)} noValidate>
        <Flex direction="column" gap={6} maxW="lg">
          <AppointmentFormPatient
            patients={patientOptions}
            providers={providerOptions}
          />
          <Button
            type="submit"
            alignSelf="flex-start"
            loading={isSubmitting}
          >
            Create appointment
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
}

export { AppointmentCreateFormContainer };
