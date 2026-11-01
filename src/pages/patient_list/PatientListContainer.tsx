import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { PatientList } from "@/components/patient_list/PatientList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { PatientCreateDialog } from "./PatientCreateContainer";
import { PageHeader } from "@/components/PageHeader";

function PatientListContainer() {
  const { data, isFetching, isError } = useFetchPatientList();

  if (isFetching) {
    return (
      <>
        <PageHeader title="Patients" />
        <LoadingSpinner label="Loading patients information" />
      </>
    );
  }

  if (!data || isError) {
    return (
      <>
        <PageHeader title="Patients" />
        <ErrorAlert headingLevel={2} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Patients" headerAction={<PatientCreateDialog />} />
      <PatientList patients={data} />
    </>
  );
}

export { PatientListContainer };
