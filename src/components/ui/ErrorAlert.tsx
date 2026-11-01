import { Icon } from "@chakra-ui/react/icon";
import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";
import { Text } from "@chakra-ui/react/text";
import { Link } from "@chakra-ui/react/link";
import { LuZapOff } from "react-icons/lu";

interface TErrorAlertProps {
  /**
   * Heading level for the message. Default 1 (when the error replaces the whole
   * page); use 2 when the page already has its own h1, so there's only one.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

function ErrorAlert({ headingLevel = 1 }: TErrorAlertProps) {
  return (
    <Flex
      direction="column"
      w="full"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Icon size="2xl" aria-hidden>
        <LuZapOff />
      </Icon>
      <Heading as={`h${headingLevel}`} size="2xl">
        Oh no! You've run into an error!
      </Heading>
      <Text>
        Try refreshing the page. If that doesn't work, contact us at{" "}
        <Link href="mailto:samantharoseabbott+fakeemail@gmail.com">
          fakeemail@fakeemailplace.com
        </Link>
      </Text>
    </Flex>
  );
}

export { ErrorAlert };
