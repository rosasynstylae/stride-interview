import { Flex, type FlexProps } from "@chakra-ui/react";

function PageLayout({ children, ...props }: FlexProps) {
  return (
    <Flex align="center" gap="2" p="4" {...props}>
      {children}
    </Flex>
  );
}

export { PageLayout };
