import { PageLayout } from "@/components/PageLayout";
import { getPageTitle } from "@/utils/getPageTitle";
import { useParams } from "react-router";
import { PatientDetailsHeaderBar } from "./PatientDetailsHeaderBar";
import {
  PatientDetailsContainer,
  PatientNotFound,
} from "./PatientDetailsContainer";

function PatientDetailsPage() {
  const { id } = useParams();

  return (
    <PageLayout
      title={getPageTitle("Patient Details")}
      headerBar={<PatientDetailsHeaderBar />}
    >
      {id ? <PatientDetailsContainer id={id} /> : <PatientNotFound />}
    </PageLayout>
  );
}

export default PatientDetailsPage;
