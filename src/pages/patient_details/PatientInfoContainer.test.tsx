import { act, screen, waitFor } from "@testing-library/react";
import { PATIENT_URLS } from "@/api/urls";
import { Toaster } from "@/components/ui/toaster";
import { PATIENT } from "@/test/fixtures";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderWithProviders } from "@/test/render";
import { PatientInfoContainer } from "./PatientInfoContainer";

setupNock();

/**
 * Toaster subscribes to the toast store on a setTimeout after mounting; flush
 * that inside act() so it doesn't land after a synchronous test has finished.
 */
async function renderContainer() {
  const result = renderWithProviders(
    <>
      <PatientInfoContainer patient={PATIENT} />
      <Toaster />
    </>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return result;
}

const editButton = () => screen.getByRole("button", { name: "Edit Patient" });
const firstName = () => screen.getByRole("textbox", { name: /first name/i });
const save = () => screen.getByRole("button", { name: "Save" });

describe("PatientInfoContainer", () => {
  it("shows the patient's details with an edit button", async () => {
    await renderContainer();

    expect(screen.getByRole("heading", { level: 1, name: "Eli Dicki" })).toBeInTheDocument();
    expect(screen.getByText("Feb 25, 2003")).toBeInTheDocument();
    expect(editButton()).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("switches to a form pre-filled with the patient's details", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());

    // Name stays as the page heading while editing
    expect(screen.getByRole("heading", { level: 1, name: "Eli Dicki" })).toBeInTheDocument();
    expect(firstName()).toHaveValue("Eli");
    expect(screen.getByRole("textbox", { name: /last name/i })).toHaveValue("Dicki");
    // ISO datetime from the API → the UTC calendar date in the picker
    expect(screen.getByRole("textbox", { name: /date of birth/i })).toHaveValue("02/25/2003");
  });

  it("moves focus into the form, and back to the Edit button on cancel", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());
    // The Edit button is gone; focus shouldn't fall back to <body>
    expect(firstName()).toHaveFocus();
    expect(screen.getByRole("form", { name: "Edit patient details" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(editButton()).toHaveFocus();
  });

  it("discards edits on cancel", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.clear(firstName());
    await user.type(firstName(), "Elias");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Eli Dicki" })).toBeInTheDocument();

    // Re-opening starts from the saved values again
    await user.click(editButton());
    expect(firstName()).toHaveValue("Eli");
  });

  it("keeps Save available, and on an invalid submit shows the error and focuses the field", async () => {
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.clear(firstName());
    // Move focus away so we can check it's sent back to the invalid field
    await user.click(screen.getByRole("textbox", { name: /last name/i }));

    // Never disabled: disabled buttons are skipped by Tab and don't explain why
    expect(save()).toBeEnabled();
    await user.click(save());

    expect(await screen.findByText("First name is required")).toBeInTheDocument();
    await waitFor(() => expect(firstName()).toHaveFocus());
    // No PUT is mocked, so a request would have failed and shown the error toast
    expect(screen.queryByText("Couldn't save the patient")).not.toBeInTheDocument();
  });

  it("saves the changes with a PUT and returns to the details view", async () => {
    let body: Record<string, unknown> | undefined;
    api()
      .put(apiPath(PATIENT_URLS.UPDATE(PATIENT.id)), (b: Record<string, unknown>) => {
        body = b;
        return true;
      })
      .reply(200, { ...PATIENT, firstName: "Elias" });
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.clear(firstName());
    await user.type(firstName(), "Elias");
    await user.click(save());

    await waitFor(() => expect(screen.queryByRole("textbox")).not.toBeInTheDocument());
    expect(body).toEqual(
      expect.objectContaining({
        firstName: "Elias",
        lastName: "Dicki",
        phoneNumber: "+16135385542",
      }),
    );
  });

  it("stays in the form and shows a toast when saving fails", async () => {
    api().put(apiPath(PATIENT_URLS.UPDATE(PATIENT.id))).reply(500, "boom");
    const { user } = await renderContainer();

    await user.click(editButton());
    await user.click(save());

    expect(await screen.findByText("Couldn't save the patient")).toBeInTheDocument();
    expect(firstName()).toHaveValue("Eli");
  });
});
