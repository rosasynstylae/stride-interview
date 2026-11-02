import { screen, within } from "@testing-library/react";
import { Table } from "@chakra-ui/react/table";
import { renderWithProviders } from "@/test/render";
import { AppointmentList } from "./AppointmentList";

describe("AppointmentList", () => {
  it("labels the table with its heading", () => {
    renderWithProviders(<AppointmentList>{null}</AppointmentList>);

    expect(
      screen.getByRole("table", { name: "Appointments" }),
    ).toBeInTheDocument();
  });

  it("renders its children as the table's rows", () => {
    renderWithProviders(
      <AppointmentList>
        <Table.Row>
          <Table.Cell>First</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Second</Table.Cell>
        </Table.Row>
      </AppointmentList>,
    );

    // Header row + the two children
    const [, ...bodyRows] = screen.getAllByRole("row");
    expect(bodyRows.map((row) => row.textContent)).toEqual(["First", "Second"]);
    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
  });

  it("shows the header action next to the heading", () => {
    renderWithProviders(
      <AppointmentList headerAction={<button type="button">Add</button>}>
        {null}
      </AppointmentList>,
    );

    const heading = screen.getByRole("heading", { name: "Appointments" });
    expect(
      within(heading.parentElement!).getByRole("button", { name: "Add" }),
    ).toBeInTheDocument();
  });
});
