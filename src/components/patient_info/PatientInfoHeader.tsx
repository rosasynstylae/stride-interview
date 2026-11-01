import type { TPatient } from "@/utils/types/patient";
import { ActionHeading } from "../ActionHeading";
import { getPatientName } from "@/utils/getPatientName";

interface TPatientInfoHeaderProps {
  patient: TPatient;
  headerAction?: React.ReactNode;
}

function PatientInfoHeader({ patient, headerAction }: TPatientInfoHeaderProps) {
  return (
    <ActionHeading
      title={getPatientName(patient)}
      headerAction={headerAction}
      alignItems="center"
      gap={3}
      justifyContent={undefined}
    />
  );
}

export { PatientInfoHeader };
