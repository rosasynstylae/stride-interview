import { screen } from "@testing-library/react";
import { PATIENT } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { PatientInfoHeader } from "./PatientInfoHeader";

describe("PatientInfoHeader", () => {
  it("shows the patient's full name as the page heading", () => {
    renderWithProviders(<PatientInfoHeader patient={PATIENT} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Eli Dicki" }),
    ).toBeInTheDocument();
  });

  it("renders the header action next to the name", () => {
    renderWithProviders(
      <PatientInfoHeader
        patient={PATIENT}
        headerAction={<button type="button">Edit</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
