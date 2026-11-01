import { Flex, type FlexProps } from "@chakra-ui/react/flex";
import { Heading, type HeadingProps } from "@chakra-ui/react/heading";

interface TActionHeadingProps extends Omit<FlexProps, "title"> {
  title: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: HeadingProps["size"];
  headerAction?: React.ReactNode;
  headingId?: string;
}

function ActionHeading({
  title,
  headingLevel = "h1",
  size = "2xl",
  headerAction,
  headingId,
  ...props
}: TActionHeadingProps) {
  return (
    <Flex justifyContent="space-between" w="full" {...props}>
      <Heading as={headingLevel} size={size} id={headingId}>
        {title}
      </Heading>
      {headerAction}
    </Flex>
  );
}

export { ActionHeading };
