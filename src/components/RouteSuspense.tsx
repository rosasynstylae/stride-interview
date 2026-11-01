import { Suspense } from "react";
import { Flex } from "@chakra-ui/react/flex";
import { Outlet } from "react-router";
import { LoadingSpinner } from "./ui/LoadingSpinner";

function RouteSuspense() {
  return (
    <Suspense
      fallback={
        <Flex minH="50vh" align="center" justify="center">
          <LoadingSpinner label="Loading page" />
        </Flex>
      }
    >
      <Outlet />
    </Suspense>
  );
}

export { RouteSuspense };
