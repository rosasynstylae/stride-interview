import { Card } from "@chakra-ui/react/card";
import { Button } from "@chakra-ui/react/button";
import { Link } from "react-router";

interface TQuickLinkCardProps {
  link: string;
  children: React.ReactNode | React.ReactNode[];
}

function QuickLinkCard({ link, children }: TQuickLinkCardProps) {
  return (
    <Card.Root width={{ base: "full", md: "320px" }} variant="outline" asChild>
      <Link to={link}>
        <Card.Body gap="2">{children}</Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button>Go</Button>
        </Card.Footer>
      </Link>
    </Card.Root>
  );
}

export { QuickLinkCard };
