import { HeaderBar } from "@/components/HeaderBar";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { NavLink } from "react-router";

function AppointmentCreationHeaderBar() {
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
            <Breadcrumb.CurrentLink>New appointment</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

export { AppointmentCreationHeaderBar };
