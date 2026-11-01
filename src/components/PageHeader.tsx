import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";

interface TPageHeaderProps {
  title: string;
  headerAction?: React.ReactNode;
}

function PageHeader({ title, headerAction }: TPageHeaderProps) {
  return (
    <Flex justifyContent="space-between" w="full">
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      {headerAction}
    </Flex>
  );
}

export { PageHeader };
