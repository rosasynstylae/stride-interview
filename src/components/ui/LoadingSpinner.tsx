import { Flex } from "@chakra-ui/react/flex";
import { Spinner } from "@chakra-ui/react/spinner";

function LoadingSpinner() {
  return (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );
}

export { LoadingSpinner };
