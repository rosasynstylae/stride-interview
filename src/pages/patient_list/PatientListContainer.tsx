import { useFetchPatientList } from "@/api/patient/fetchPatientList";
import { PatientList } from "@/components/patient_list/PatientList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { PatientCreateDialog } from "./PatientCreateContainer";
import { PageHeader } from "@/components/PageHeader";

function PatientListContainer() {
  const { data, isPending, isError } = useFetchPatientList();

  if (isPending) {
    return (
      <>
        <PageHeader title="Patients" />
        <LoadingSpinner label="Loading patients information" />
      </>
    );
  }

  // decided to always show error if an endpoint errors,
  // as if the issue is a network blip, a refresh will fix.
  // if the error is bigger than a network blip, we should show
  // the error
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
