import { PatientForm } from "@/components/patient_form/PatientForm";
import { usePatientForm } from "@/components/patient_form/usePatientForm";
import { toPatientFormValues } from "@/components/patient_form/toPatientFormValues";
import { PatientInfo } from "@/components/patient_info/PatientInfo";
import { PatientInfoHeader } from "@/components/patient_info/PatientInfoHeader";
import type { TPatient } from "@/utils/types/patient";
import { useOpen } from "@/utils/useOpen";
import { Button, IconButton } from "@chakra-ui/react/button";
import { Flex } from "@chakra-ui/react/flex";
import { LuPencil } from "react-icons/lu";
import { useUpdatePatient } from "@/api/patient/updatePatient";

interface TPatientFormContainerProps {
  patient: TPatient;
  onCancel: () => void;
  onSuccess?: () => void;
}

function PatientFormContainer({
  patient,
  onSuccess,
  onCancel,
}: TPatientFormContainerProps) {
  const { mutateAsync } = useUpdatePatient();
  const { submitForm, control, reset, formState } = usePatientForm({
    defaultValues: toPatientFormValues(patient),
    onSubmit: async (vals) => {
      try {
        await mutateAsync({ patientId: patient.id, patientInfo: vals });
        onSuccess?.();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  const cancel = () => {
    onCancel();
    reset();
  };

  const { isValid, isSubmitting } = formState;

  return (
    <Flex direction="column" gap={3}>
      <PatientInfoHeader patient={patient} />
      <Flex
        direction="column"
        gap={3}
        asChild
        w={{ base: "full", md: "1/2", lg: "1/3" }}
      >
        <form onSubmit={(e) => void submitForm(e)} noValidate>
          <PatientForm control={control} />
          <Flex gap={3} justifyContent="flex-end">
            <Button onClick={cancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid} loading={isSubmitting}>
              Save
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}

interface TPatientInfoContainerProps {
  patient: TPatient;
}

function PatientInfoContainer({ patient }: TPatientInfoContainerProps) {
  const { open, onClose, onOpen } = useOpen();

  if (open) {
    return (
      <PatientFormContainer
        patient={patient}
        onCancel={onClose}
        onSuccess={onClose}
      />
    );
  }

  return (
    <PatientInfo
      patient={patient}
      header={
        <PatientInfoHeader
          patient={patient}
          headerAction={
            <IconButton
              onClick={onOpen}
              aria-label="Edit Patient"
              variant="ghost"
            >
              <LuPencil />
            </IconButton>
          }
        />
      }
    />
  );
}

export { PatientInfoContainer };
