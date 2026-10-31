import { PageLayout } from "@/components/PageLayout";
import { Breadcrumb } from "@chakra-ui/react/breadcrumb";
import { HeaderBar } from "@/components/HeaderBar";
import { QuickLinks } from "@/components/home/QuickLinks";

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
    <PageLayout headerBar={<HomeHeaderBar />}>
      <QuickLinks />
    </PageLayout>
  );
}

export default Home;
