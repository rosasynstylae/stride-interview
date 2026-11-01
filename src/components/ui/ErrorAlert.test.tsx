import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { ErrorAlert } from "./ErrorAlert";

const heading = (level: number) =>
  screen.getByRole("heading", { level, name: /you've run into an error/i });

describe("ErrorAlert", () => {
  it("uses an h1 by default, for when it replaces the whole page", () => {
    renderWithProviders(<ErrorAlert />);

    expect(heading(1)).toBeInTheDocument();
  });

  it("uses the given heading level when the page already has an h1", () => {
    renderWithProviders(<ErrorAlert headingLevel={2} />);

    expect(heading(2)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});
