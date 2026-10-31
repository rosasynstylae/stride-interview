import { Flex, type FlexProps } from "@chakra-ui/react/flex";

interface TPageLayoutProps extends FlexProps {
  title: string;
  headerBar: React.ReactNode | React.ReactNode[];
}

function PageLayout({
  children,
  headerBar,
  title,
  ...props
}: TPageLayoutProps) {
  return (
    <Flex align="center" direction="column" gap="2" {...props}>
      <title>{title}</title>
      {headerBar}
      <Flex as="main" direction="row" align="start" p="4" w="full">
        {children}
      </Flex>
    </Flex>
  );
}

export { PageLayout };
