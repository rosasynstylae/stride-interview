import { Drawer } from "@chakra-ui/react/drawer";
import { Button, CloseButton, IconButton } from "@chakra-ui/react/button";
import { NavLink, useMatch } from "react-router";
import { LuMenu } from "react-icons/lu";
import { Stack } from "@chakra-ui/react/stack";

interface TNavigationItemProps {
  link: string;
  title: string;
  end?: boolean;
}

function NavigationItem({ link, title, end = false }: TNavigationItemProps) {
  // Same matching NavLink uses for aria-current="page", so the style and the
  // screen reader announcement agree (e.g. Patient List is current on /patients/:id)
  const isCurrent = useMatch({ path: link, end }) !== null;

  return (
    <li>
      <Drawer.ActionTrigger asChild>
        <Button asChild w="full" variant={isCurrent ? "surface" : "solid"}>
          <NavLink to={link} end={end}>{title}</NavLink>
        </Button>
      </Drawer.ActionTrigger>
    </li>
  );
}

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
                <NavigationItem title="Home" link="/" end />
                <NavigationItem title="Patient List" link="/patients" />
                <NavigationItem title="New Appointment" link="/appointments" />
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
