import { Navigation } from "./Navigation";
import { chakra } from "@chakra-ui/react";

interface THeaderBar {
  children: React.ReactNode | React.ReactNode[];
}

function HeaderBar({ children }: THeaderBar) {
  return (
    <chakra.header
      w="full"
      display="flex"
      gap={4}
      p={2}
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor="gray"
    >
      <Navigation />
      <nav>{children}</nav>
    </chakra.header>
  );
}

export { HeaderBar };
