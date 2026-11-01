import { Dialog } from "@chakra-ui/react/dialog";
import { chakra, type HTMLChakraProps } from "@chakra-ui/react/styled-system";

interface TDialogFormContentProps extends Omit<
  HTMLChakraProps<"form">,
  "display"
> {
  // requiring this, as it's a form
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  /** Dialog.Header / Body / Footer / CloseTrigger, rendered inside the form */
  children: React.ReactNode | React.ReactNode[];
}

/**
 * Dialog.Content whose children sit inside a <form>, so the footer's
 * type="submit" button and Enter in a field both submit it.
 *
 * The form goes inside the dialog rather than being the dialog (role="dialog"
 * isn't allowed on <form>), and display: contents keeps Header/Body/Footer laid
 * out as the dialog's own children.
 */
function DialogFormContent({
  noValidate = true,
  ...props
}: TDialogFormContentProps) {
  return (
    <Dialog.Content>
      <chakra.form display="contents" noValidate={noValidate} {...props} />
    </Dialog.Content>
  );
}

export { DialogFormContent };
