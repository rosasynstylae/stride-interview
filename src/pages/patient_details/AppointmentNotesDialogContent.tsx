import { Button, CloseButton } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { AppointmentNotesForm } from "@/components/appointment_notes/AppointmentNotesForm";
import type { TAppointmentNotesFormValues } from "@/components/appointment_notes/types";
import type { TAppointmentNotesFormOutput } from "@/components/appointment_notes/useAppointmentNotesForm";

interface TAppointmentNotesDialogContentProps {
  title: string;
  form: UseFormReturn<
    TAppointmentNotesFormValues,
    unknown,
    TAppointmentNotesFormOutput
  >;
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

/** Shared dialog body for creating and editing notes; the trigger lives in AppointmentNotesDialog */
function AppointmentNotesDialogContent({
  title,
  form,
  submitForm,
}: TAppointmentNotesDialogContentProps) {
  const { isValid, isDirty, isSubmitting } = form.formState;

  return (
    <FormProvider {...form}>
      {/* Content renders as the <form> so Body/Footer keep the dialog's layout */}
      <Dialog.Content asChild>
        <form onSubmit={(e) => void submitForm(e)} noValidate>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <AppointmentNotesForm />
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
  );
}

export { AppointmentNotesDialogContent };
