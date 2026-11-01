import type { TPatient } from "@/utils/types/patient";
import { PageHeader } from "../PageHeader";

interface TPatientInfoHeaderProps {
  patient: TPatient;
  headerAction?: React.ReactNode;
}

function PatientInfoHeader({ patient, headerAction }: TPatientInfoHeaderProps) {
  return (
    <PageHeader
      title={`${patient.firstName} ${patient.lastName}`}
      headerAction={headerAction}
    />
  );
}

export { PatientInfoHeader };
