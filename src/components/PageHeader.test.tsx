import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title as the page's only h1", () => {
    renderWithProviders(<PageHeader title="Patients" />);

    expect(screen.getByRole("heading", { level: 1, name: "Patients" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("renders nothing besides the title when there's no header action", () => {
    renderWithProviders(<PageHeader title="Patients" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the header action after the title", () => {
    renderWithProviders(
      <PageHeader title="Patients" headerAction={<button type="button">Add patient</button>} />,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Patients" });
    const action = screen.getByRole("button", { name: "Add patient" });
    // Title first in reading/tab order, then the action
    expect(heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
