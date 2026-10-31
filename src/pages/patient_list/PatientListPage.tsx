import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { PatientListHeaderBar } from "./PatientListHeaderBar";
import { PatientListContainer } from "./PatientListContainer";

function PatientListPage() {
  return (
    <PageLayout
      title={getPageTitle("Patients")}
      headerBar={<PatientListHeaderBar />}
    >
      <PatientListContainer />
    </PageLayout>
  );
}

export default PatientListPage;
