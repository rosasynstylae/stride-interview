import { HeaderBar } from "@/components/HeaderBar";
import { PageLayout } from "@/components/PageLayout";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { Heading } from "@chakra-ui/react/heading";
import { NavLink } from "react-router";

function AppointmentListHeaderBar() {
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
            <Breadcrumb.CurrentLink>Appointments</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

function AppointmentList() {
  return (
    <PageLayout headerBar={<AppointmentListHeaderBar />}>
      <Heading size="xl">Appointment List - In Progress 🚧</Heading>
    </PageLayout>
  );
}

export default AppointmentList;
