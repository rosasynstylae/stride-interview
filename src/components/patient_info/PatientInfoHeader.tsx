import type { TPatient } from "@/utils/types/patient";
import { Flex } from "@chakra-ui/react/flex";
import { Heading } from "@chakra-ui/react/heading";

interface TPatientInfoHeaderProps {
  patient: TPatient;
  headerAction?: React.ReactNode;
}

function PatientInfoHeader({ patient, headerAction }: TPatientInfoHeaderProps) {
  return (
    <Flex w="full" gap={3} alignItems="center">
      <Heading as="h1" size="2xl">
        {patient.firstName} {patient.lastName}
      </Heading>
      {headerAction}
    </Flex>
  );
}

export { PatientInfoHeader };
