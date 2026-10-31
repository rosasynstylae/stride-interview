import { HeaderBar } from "@/components/HeaderBar";
import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { Heading } from "@chakra-ui/react/heading";
import { NavLink } from "react-router";

function PatientListHeaderBar() {
  return (
    <HeaderBar>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <NavLink to="/">Home</NavLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Patients</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

function PatientList() {
  return (
    <PageLayout
      title={getPageTitle("Patients")}
      headerBar={<PatientListHeaderBar />}
    >
      <Heading as="h1" size="xl">
        Patient List - In Progress 🚧
      </Heading>
    </PageLayout>
  );
}

export default PatientList;
