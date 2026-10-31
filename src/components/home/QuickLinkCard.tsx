import { Card } from "@chakra-ui/react/card";
import { Button } from "@chakra-ui/react/button";
import { Link } from "react-router";

interface TQuickLinkCardProps {
  link: string;
  children: React.ReactNode | React.ReactNode[];
}

function QuickLinkCard({ link, children }: TQuickLinkCardProps) {
  return (
    <Card.Root
      width={{ base: "full", md: "320px" }}
      variant="outline"
      focusRing="outside"
      asChild
    >
      <Link to={link}>
        <Card.Body gap="2">{children}</Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button asChild type={undefined}>
            <span aria-hidden="true">Go</span>
          </Button>
        </Card.Footer>
      </Link>
    </Card.Root>
  );
}

export { QuickLinkCard };
