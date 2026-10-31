import { PageLayout } from "@/components/PageLayout";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { HeaderBar } from "@/components/HeaderBar";
import { QuickLinks } from "@/components/home/QuickLinks";
import { VisuallyHidden } from "@chakra-ui/react";
import { getPageTitle } from "@/utils/getPageTitle";

function HomeHeaderBar() {
  return (
    <HeaderBar>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Home</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </HeaderBar>
  );
}

function Home() {
  return (
    <PageLayout title={getPageTitle("Home")} headerBar={<HomeHeaderBar />}>
      <VisuallyHidden as="h1">Home</VisuallyHidden>
      <QuickLinks />
    </PageLayout>
  );
}

export default Home;
