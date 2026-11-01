import { useEffect } from "react";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { isRouteErrorResponse, NavLink, useRouteError } from "react-router";
import { getPageTitle } from "@/utils/getPageTitle";
import { HeaderBar } from "./HeaderBar";
import { PageLayout } from "./PageLayout";
import { ErrorAlert } from "./ui/ErrorAlert";
import { Alert404 } from "./ui/Alert404";

function ErrorHeaderBar() {
  return (
    <HeaderBar>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <NavLink to="/">Home</NavLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

/**
 * Route-level error boundary: catches render errors in any page, failed lazy
 * page imports, and unmatched URLs. Keeps the header so users can navigate away.
 */
function RouteErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout
      title={getPageTitle(is404 ? "404" : "Error")}
      headerBar={<ErrorHeaderBar />}
    >
      {is404 ? <Alert404 /> : <ErrorAlert />}
    </PageLayout>
  );
}

export { RouteErrorBoundary };
