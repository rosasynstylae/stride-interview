import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { ActionHeading } from "./ActionHeading";

describe("ActionHeading", () => {
  it("renders the title as an h1 by default", () => {
    renderWithProviders(<ActionHeading title="Patients" />);

    expect(screen.getByRole("heading", { level: 1, name: "Patients" })).toBeInTheDocument();
  });

  it.each([2, 3, 6] as const)("renders an h%i when asked", (level) => {
    renderWithProviders(<ActionHeading title="Notes" headingLevel={`h${level}`} />);

    expect(screen.getByRole("heading", { level, name: "Notes" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("gives the heading an id so a region can be named by it", () => {
    renderWithProviders(
      <section aria-labelledby="notes-heading">
        <ActionHeading title="Notes" headingId="notes-heading" headingLevel="h2" />
      </section>,
    );

    expect(screen.getByRole("heading", { name: "Notes" })).toHaveAttribute("id", "notes-heading");
    expect(screen.getByRole("region", { name: "Notes" })).toBeInTheDocument();
  });

  it("renders the header action after the title", () => {
    renderWithProviders(
      <ActionHeading title="Notes" headerAction={<button type="button">Add note</button>} />,
    );

    const heading = screen.getByRole("heading", { name: "Notes" });
    const action = screen.getByRole("button", { name: "Add note" });
    // Title first in reading/tab order, then the action
    expect(heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders only the heading when there's no action", () => {
    renderWithProviders(<ActionHeading title="Notes" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("accepts rich titles", () => {
    renderWithProviders(
      <ActionHeading
        title={
          <>
            Notes <span>(2)</span>
          </>
        }
      />,
    );

    expect(screen.getByRole("heading", { name: "Notes (2)" })).toBeInTheDocument();
  });

  it("passes layout props through to the wrapper", () => {
    renderWithProviders(<ActionHeading title="Notes" data-testid="wrapper" />);

    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toContainElement(screen.getByRole("heading", { name: "Notes" }));
  });
});
