import { Drawer } from "@chakra-ui/react/drawer";
import { Button, CloseButton, IconButton } from "@chakra-ui/react/button";
import { NavLink } from "react-router";
import { LuMenu } from "react-icons/lu";
import { Stack } from "@chakra-ui/react/stack";

function Navigation() {
  return (
    <Drawer.Root placement="start">
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        <IconButton aria-label="Open navigation">
          <LuMenu />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <nav aria-label="Main">
              <Stack as="ul" listStyleType="none" gap="2">
                <li>
                  <Drawer.ActionTrigger asChild>
                    <Button asChild w="full">
                      <NavLink to="/patients">Patient List</NavLink>
                    </Button>
                  </Drawer.ActionTrigger>
                </li>
                <li>
                  <Drawer.ActionTrigger asChild>
                    <Button asChild w="full">
                      <NavLink to="/appointments">New Appointment</NavLink>
                    </Button>
                  </Drawer.ActionTrigger>
                </li>
              </Stack>
            </nav>
          </Drawer.Body>

          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}

export { Navigation };
