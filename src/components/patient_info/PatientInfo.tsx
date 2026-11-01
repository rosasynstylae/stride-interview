import type { TPatient } from "@/utils/types/patient";
import { formatBirthDate, formatDate } from "@/utils/formatDate";
import { DataList } from "@chakra-ui/react/data-list";
import { Flex } from "@chakra-ui/react/flex";
import { Link } from "@chakra-ui/react/link";

interface TPatientInfoProps {
  patient: TPatient;
  header?: React.ReactNode;
}

function PatientInfo({ patient, header }: TPatientInfoProps) {
  return (
    <Flex direction="column" gap={4} w="full">
      {header}
      <DataList.Root orientation="horizontal">
        <DataList.Item>
          <DataList.ItemLabel>Date of birth</DataList.ItemLabel>
          <DataList.ItemValue>
            <time dateTime={patient.dateOfBirth}>
              {formatBirthDate(patient.dateOfBirth)}
            </time>
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Phone</DataList.ItemLabel>
          <DataList.ItemValue>
            <Link href={`tel:${patient.phoneNumber}`}>
              {patient.phoneNumber}
            </Link>
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Patient since</DataList.ItemLabel>
          <DataList.ItemValue>
            <time dateTime={patient.createdAt}>
              {formatDate(patient.createdAt)}
            </time>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    </Flex>
  );
}

export { PatientInfo };
