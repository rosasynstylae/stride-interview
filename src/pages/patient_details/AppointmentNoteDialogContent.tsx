import { Button, CloseButton } from "@chakra-ui/react/button";
import { Dialog } from "@chakra-ui/react/dialog";
import { DialogFormContent } from "@/components/ui/DialogFormContent";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { AppointmentNotesForm } from "@/components/appointment_notes/AppointmentNotesForm";
import type { TAppointmentNotesFormValues } from "@/components/appointment_notes/types";
import type { TAppointmentNotesFormOutput } from "@/components/appointment_notes/useAppointmentNotesForm";

interface TAppointmentNoteDialogContentProps {
  title: string;
  form: UseFormReturn<
    TAppointmentNotesFormValues,
    unknown,
    TAppointmentNotesFormOutput
  >;
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

/** Shared dialog body for adding and editing a note; each dialog owns its trigger */
function AppointmentNoteDialogContent({
  title,
  form,
  submitForm,
}: TAppointmentNoteDialogContentProps) {
  const { isSubmitting } = form.formState;

  return (
    <FormProvider {...form}>
      <DialogFormContent onSubmit={(e) => void submitForm(e)}>
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
          <Button type="submit" loading={isSubmitting}>
            Save
          </Button>
        </Dialog.Footer>
        <Dialog.CloseTrigger asChild>
          <CloseButton size="sm" />
        </Dialog.CloseTrigger>
      </DialogFormContent>
    </FormProvider>
  );
}

export { AppointmentNoteDialogContent };
