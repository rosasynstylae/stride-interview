import { HeaderBar } from "@/components/HeaderBar";
import { Heading } from "@chakra-ui/react/heading";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { PageLayout } from "@/components/PageLayout";
import { NavLink } from "react-router";
import { getPageTitle } from "@/utils/getPageTitle";

function PatientDetailsHeaderBar() {
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
            <Breadcrumb.Link asChild>
              <NavLink to="/patients">Patients</NavLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Details</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

function PatientDetails() {
  return (
    <PageLayout
      title={getPageTitle("Patient Details")}
      headerBar={<PatientDetailsHeaderBar />}
    >
      <Heading as="h1" size="xl">
        Patient Details - In Progress 🚧
      </Heading>
    </PageLayout>
  );
}

export default PatientDetails;
