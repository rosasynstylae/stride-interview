import { Dialog } from "@chakra-ui/react/dialog";
import { Button, CloseButton } from "@chakra-ui/react/button";
import { Portal } from "@chakra-ui/react/portal";
import { PatientForm } from "@/components/patient_form/PatientForm";
import { usePatientForm } from "@/components/patient_form/usePatientForm";
import { useOpen } from "@/utils/useOpen";
import { useCreatePatient } from "@/api/patient/createPatient";

function PatientCreateDialog() {
  const { open, setOpen, onClose } = useOpen();
  const { mutateAsync } = useCreatePatient();

  const { submitForm, control, reset, formState } = usePatientForm({
    onSubmit: async (vals) => {
      try {
        await mutateAsync({ patientInfo: vals });
        onClose();
      } catch {
        // The mutation's onError shows a toast; keep the dialog open with the values intact
      }
    },
  });

  const { isValid, isDirty, isSubmitting } = formState;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onExitComplete={() => reset()}
    >
      <Dialog.Trigger asChild>
        <Button>Add patient</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          {/* Content renders as the <form> so Body/Footer keep the dialog's layout */}
          <Dialog.Content asChild>
            <form onSubmit={(e) => void submitForm(e)} noValidate>
              <Dialog.Header>
                <Dialog.Title>Add patient</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <PatientForm control={control} />
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
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export { PatientCreateDialog };
