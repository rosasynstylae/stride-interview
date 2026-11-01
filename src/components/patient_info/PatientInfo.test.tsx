import { screen } from "@testing-library/react";
import { PATIENT } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { PatientInfo } from "./PatientInfo";

/** The <dd> paired with a <dt> label (terms don't get an accessible name, so match text) */
const valueFor = (label: string) => {
  const term = screen.getAllByRole("term").find((t) => t.textContent === label);
  const value = term?.nextElementSibling;
  if (!(value instanceof HTMLElement)) throw new Error(`No value for "${label}"`);
  return value;
};

describe("PatientInfo", () => {
  it("lists the patient's details as label/value pairs", () => {
    renderWithProviders(<PatientInfo patient={PATIENT} />);

    expect(screen.getAllByRole("term").map((t) => t.textContent)).toEqual([
      "Date of birth",
      "Phone",
      "Patient since",
    ]);
  });

  it("shows the birthday in UTC so it's the same day in every timezone", () => {
    renderWithProviders(<PatientInfo patient={PATIENT} />);

    // Stored as 2003-02-25T01:44Z: local time in the Americas would be Feb 24
    expect(valueFor("Date of birth")).toHaveTextContent("Feb 25, 2003");
    expect(valueFor("Date of birth").querySelector("time")).toHaveAttribute(
      "datetime",
      PATIENT.dateOfBirth,
    );
  });

  it("links the phone number for calling", () => {
    renderWithProviders(<PatientInfo patient={PATIENT} />);

    expect(screen.getByRole("link", { name: "(613) 538-5542" })).toHaveAttribute(
      "href",
      "tel:(613) 538-5542",
    );
  });

  it("shows when the patient record was created", () => {
    renderWithProviders(<PatientInfo patient={PATIENT} />);

    expect(valueFor("Patient since")).toHaveTextContent("Jan 28, 2025");
  });

  it("renders the header slot above the details", () => {
    renderWithProviders(
      <PatientInfo patient={PATIENT} header={<h1>Custom header</h1>} />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom header" }),
    ).toBeInTheDocument();
  });
});
