import { ActionHeading } from "./ActionHeading";

interface TPageHeaderProps {
  title: React.ReactNode;
  headerAction?: React.ReactNode;
}

function PageHeader({ title, headerAction }: TPageHeaderProps) {
  return <ActionHeading title={title} headerAction={headerAction} />;
}

export { PageHeader };
