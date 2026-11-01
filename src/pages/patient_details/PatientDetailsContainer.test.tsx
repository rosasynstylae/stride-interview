import { screen } from "@testing-library/react";
import { PATIENT_URLS, PROVIDER_URLS } from "@/api/urls";
import { PATIENT } from "@/test/fixtures";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderWithProviders } from "@/test/render";
import { PatientDetailsContainer } from "./PatientDetailsContainer";

setupNock();

interface TMockOptions {
  patient?: [number, unknown];
  patientTimes?: number;
}

/**
 * Mocks the container's three requests. Appointments 404 (= none) so no
 * per-row notes requests are made; the page-level tests cover the table.
 */
function mockRequests({ patient = [200, PATIENT], patientTimes = 1 }: TMockOptions = {}) {
  api().get(apiPath(PATIENT_URLS.DETAILS("1"))).times(patientTimes).reply(...patient);
  api().get(apiPath(PATIENT_URLS.APPOINTMENTS("1"))).reply(404, "Not found");
  api().get(apiPath(PROVIDER_URLS.FETCH_LIST)).reply(200, []);
}

const renderContainer = () => renderWithProviders(<PatientDetailsContainer id="1" />);

describe("PatientDetailsContainer", () => {
  it("loads the patient, then shows their details and appointments", async () => {
    mockRequests();
    renderContainer();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Eli Dicki" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Patient" })).toBeInTheDocument();
    expect(await screen.findByText("No Appointments Found")).toBeInTheDocument();
  });

  it("opens the edit form in place of the details", async () => {
    mockRequests();
    const { user } = renderContainer();

    await user.click(await screen.findByRole("button", { name: "Edit Patient" }));

    expect(screen.getByRole("textbox", { name: /first name/i })).toHaveValue("Eli");
    // Appointments stay visible while editing the patient
    expect(await screen.findByText("No Appointments Found")).toBeInTheDocument();
  });

  it("shows 'not found' when the patient doesn't exist", async () => {
    mockRequests({ patient: [404, "Not found"] });
    renderContainer();

    expect(
      await screen.findByRole("heading", { level: 1, name: "404" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Patient not found.")).toBeInTheDocument();
  });

  it("shows the error page when the patient fails to load", async () => {
    // useFetchPatient retries non-404 errors 3 times (instant in tests: retryDelay 0)
    mockRequests({ patient: [500, "boom"], patientTimes: 4 });
    renderContainer();

    expect(
      await screen.findByRole("heading", { level: 1, name: /you've run into an error/i }),
    ).toBeInTheDocument();
  });
});
