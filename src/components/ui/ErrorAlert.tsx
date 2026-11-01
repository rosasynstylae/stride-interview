import { Icon } from "@chakra-ui/react/icon";
import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";
import { Text } from "@chakra-ui/react/text";
import { Link } from "@chakra-ui/react/link";
import { LuZapOff } from "react-icons/lu";

function ErrorAlert() {
  return (
    <Flex
      direction="column"
      w="full"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Icon size="2xl">
        <LuZapOff />
      </Icon>
      <Heading as="h1" size="2xl">
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
