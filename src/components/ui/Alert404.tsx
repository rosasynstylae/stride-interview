import { Icon } from "@chakra-ui/react/icon";
import { Flex } from "@chakra-ui/react/flex";
import { LuGhost } from "react-icons/lu";
import { Heading } from "@chakra-ui/react/heading";
import { Text } from "@chakra-ui/react/text";

function Alert404() {
  return (
    <Flex
      direction="column"
      w="full"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Icon size="2xl" aria-hidden>
        <LuGhost />
      </Icon>
      <Heading as="h1" size="2xl">
        Spooky! You've hit a 404!
      </Heading>
      <Text>
        Try returning home... before it's too late! 🦇
      </Text>
    </Flex>
  );
}

export { Alert404 };
