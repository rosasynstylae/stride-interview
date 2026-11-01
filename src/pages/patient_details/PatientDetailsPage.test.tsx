import { Route, Routes } from "react-router";
import { screen, within } from "@testing-library/react";
import { PATIENT_URLS, PROVIDER_URLS } from "@/api/urls";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import type { TPatient } from "@/utils/types/patient";
import type { TProvider } from "@/utils/types/provider";
import PatientDetailsPage from "./PatientDetailsPage";

setupNock();

const PATIENT: TPatient = {
  id: "1",
  firstName: "Karson",
  lastName: "Walter",
  dateOfBirth: "2006-09-20T16:33:50.410Z",
  createdAt: "2025-01-27T23:04:16.391Z",
  phoneNumber: "294.334.9483 x766",
};

const PROVIDERS: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
];

// Midday UTC so the displayed date is the same in any US timezone
const APPOINTMENTS: TAppointment[] = [
  {
    id: "1",
    patientId: "1",
    providerId: "1",
    startTime: "2025-02-14T16:00:00.000Z",
    endTime: "2025-02-14T17:00:00.000Z",
    type: "Initial Evaluation",
    status: "Checked In",
    createdAt: "",
  },
  {
    id: "2",
    patientId: "1",
    providerId: "99",
    startTime: "2025-03-01T16:00:00.000Z",
    endTime: "2025-03-01T16:45:00.000Z",
    type: "Follow Up",
    status: "Scheduled",
    createdAt: "",
  },
];

interface TMockOptions {
  patient?: [number, unknown];
  appointments?: [number, unknown];
  providers?: [number, unknown];
}

/** Mocks every request the page makes; override any response per test */
function mockPage({
  patient = [200, PATIENT],
  appointments = [200, APPOINTMENTS],
  providers = [200, PROVIDERS],
}: TMockOptions = {}) {
  api().get(apiPath(PATIENT_URLS.DETAILS("1"))).reply(...patient);
  api().get(apiPath(PATIENT_URLS.APPOINTMENTS("1"))).reply(...appointments);
  api().get(apiPath(PROVIDER_URLS.FETCH_LIST)).reply(...providers);
}

const renderPage = () =>
  renderWithProviders(
    <Routes>
      <Route path="/patients/:id" element={<PatientDetailsPage />} />
    </Routes>,
    { route: "/patients/1" },
  );

describe("PatientDetailsPage", () => {
  it("shows the patient's details", async () => {
    mockPage();
    renderPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Karson Walter" }),
    ).toBeInTheDocument();
    // Birthdays are shown in UTC, so this is Sep 20 in every timezone
    expect(screen.getByText("Sep 20, 2006")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "294.334.9483 x766" })).toHaveAttribute(
      "href",
      "tel:294.334.9483 x766",
    );
    expect(document.title).toBe("Patient Details | Stride");
    await screen.findByRole("table", { name: "Appointments" });
  });

  it("lists appointments with provider names, each date opening its details", async () => {
    mockPage();
    renderPage();

    const table = await screen.findByRole("table", { name: "Appointments" });
    const [, firstRow, secondRow] = within(table).getAllByRole("row");

    expect(within(firstRow).getByText("Quinten Walker")).toBeInTheDocument();
    // Unknown provider ids fall back to "Provider #ID"
    expect(within(secondRow).getByText("Provider #99")).toBeInTheDocument();

    // The date cell is the drawer trigger; no details are fetched until it's opened
    expect(
      within(firstRow).getByRole("button", { name: /^View appointment on Feb 14, 2025 at / }),
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByRole("button", { name: /^View appointment on Mar 1, 2025 at / }),
    ).toBeInTheDocument();
  });

  it("shows an empty state when the patient has no appointments", async () => {
    mockPage({ appointments: [404, "Not found"] });
    renderPage();

    expect(await screen.findByText("No Appointments Found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add appointment" })).toBeInTheDocument();
  });

  it("falls back to provider ids when providers fail to load", async () => {
    mockPage({ providers: [500, "boom"] });
    renderPage();

    const table = await screen.findByRole("table", { name: "Appointments" });
    expect(within(table).getByText("Provider #1")).toBeInTheDocument();
    expect(within(table).getByText("Provider #99")).toBeInTheDocument();
  });

  it("keeps the patient visible when appointments fail to load", async () => {
    mockPage({ appointments: [500, "boom"] });
    renderPage();

    expect(
      await screen.findByText(/There was an issue loading appointments/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Karson Walter" }),
    ).toBeInTheDocument();
  });

  it("shows 'not found' for a patient that doesn't exist", async () => {
    mockPage({ patient: [404, "Not found"], appointments: [404, "Not found"] });
    renderPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "404" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Patient not found.")).toBeInTheDocument();
  });

  it("shows the error page when the patient fails to load", async () => {
    // useFetchPatient retries non-404 errors 3 times (1 + 3 attempts); the test
    // QueryClient's retryDelay: 0 makes those retries instant
    api().get(apiPath(PATIENT_URLS.DETAILS("1"))).times(4).reply(500, "boom");
    api().get(apiPath(PATIENT_URLS.APPOINTMENTS("1"))).reply(200, APPOINTMENTS);
    api().get(apiPath(PROVIDER_URLS.FETCH_LIST)).reply(200, PROVIDERS);
    renderPage();

    // Match the stable part so copy tweaks to ErrorAlert don't break this
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /you've run into an error/i,
      }),
    ).toBeInTheDocument();
  });
});
