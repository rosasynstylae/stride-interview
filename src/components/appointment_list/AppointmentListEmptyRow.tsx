import { Table } from "@chakra-ui/react/table";
import { Text } from "@chakra-ui/react/text";

function AppointmentListEmptyRow() {
  return (
    <Table.Row>
      <Table.Cell colSpan={5} textAlign="center">
        <Text fontSize="lg">No Appointments Found</Text>
      </Table.Cell>
    </Table.Row>
  );
}

export { AppointmentListEmptyRow };
