import { Flex } from "@chakra-ui/react/flex";
import { Spinner } from "@chakra-ui/react/spinner";
import { VisuallyHidden } from "@chakra-ui/react/visually-hidden";

interface TLoadingSpinnerProps {
  /** What's loading, for screen readers (e.g. "Loading patients") */
  label?: string;
  size?: "sm" | "xl";
}

function LoadingSpinner({
  label = "Loading",
  size = "xl",
}: TLoadingSpinnerProps) {
  return (
    <Flex role="status" w="full" alignItems="center" justifyContent="center">
      <Spinner size={size} aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </Flex>
  );
}

export { LoadingSpinner };
