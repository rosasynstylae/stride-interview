import { Flex, type FlexProps } from "@chakra-ui/react/flex";

interface TPageLayoutProps extends FlexProps {
  headerBar: React.ReactNode | React.ReactNode[];
}

function PageLayout({ children, headerBar, ...props }: TPageLayoutProps) {
  return (
    <Flex align="center" direction="column" gap="2" {...props}>
      {headerBar}
      <Flex direction="row" align="start" p="4" w="full">
        {children}
      </Flex>
    </Flex>
  );
}

export { PageLayout };
