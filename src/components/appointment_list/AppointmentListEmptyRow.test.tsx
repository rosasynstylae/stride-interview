import { screen } from "@testing-library/react";
import { Table } from "@chakra-ui/react/table";
import { renderWithProviders } from "@/test/render";
import { AppointmentListEmptyRow } from "./AppointmentListEmptyRow";

describe("AppointmentListEmptyRow", () => {
  it("shows an empty state spanning all five columns", () => {
    renderWithProviders(
      <Table.Root>
        <Table.Body>
          <AppointmentListEmptyRow />
        </Table.Body>
      </Table.Root>,
    );

    const cell = screen.getByRole("cell", { name: "No Appointments Found" });
    expect(cell).toHaveAttribute("colspan", "5");
  });
});
