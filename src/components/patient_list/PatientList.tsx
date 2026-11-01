import type { TPatient } from "@/utils/types/patient";
import { Text } from "@chakra-ui/react/text";
import { Link as LinkStyled } from "@chakra-ui/react/link";
import { Link } from "react-router";
import { LuEye } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react/button";
import { Table } from "@chakra-ui/react/table";
import { formatBirthDate } from "@/utils/formatDate";

interface TPatientListProps {
  patients: TPatient[];
}

function PatientList({ patients }: TPatientListProps) {
  return (
    // Scrolls sideways on narrow screens. Focusable + labelled so keyboard
    // users can scroll it too (a scrollable region needs to be reachable)
    <Table.ScrollArea
      tabIndex={0}
      role="region"
      aria-label="Patients"
      focusRing="outside"
    >
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Patient</Table.ColumnHeader>
            <Table.ColumnHeader>Phone Number</Table.ColumnHeader>
            <Table.ColumnHeader>Birthday</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {patients.length ? (
            patients.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>
                  <LinkStyled asChild w="full" h="full">
                    <Link to={`/patients/${p.id}`}>
                      <IconButton as="span" type={undefined} variant="ghost">
                        <LuEye />
                      </IconButton>
                      {p.firstName} {p.lastName}
                    </Link>
                  </LinkStyled>
                </Table.Cell>
                <Table.Cell>
                  <LinkStyled href={`tel:${p.phoneNumber}`}>
                    {p.phoneNumber}
                  </LinkStyled>
                </Table.Cell>
                <Table.Cell>{formatBirthDate(p.dateOfBirth)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={3} textAlign="center">
                <Text fontSize="lg">No Patients Found</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

export { PatientList };
