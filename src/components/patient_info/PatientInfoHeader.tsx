import type { TPatient } from "@/utils/types/patient";
import { ActionHeading } from "../ActionHeading";

interface TPatientInfoHeaderProps {
  patient: TPatient;
  headerAction?: React.ReactNode;
}

function PatientInfoHeader({ patient, headerAction }: TPatientInfoHeaderProps) {
  return (
    <ActionHeading
      title={`${patient.firstName} ${patient.lastName}`}
      headerAction={headerAction}
      alignItems="center"
      gap={3}
      justifyContent={undefined}
    />
  );
}

export { PatientInfoHeader };
