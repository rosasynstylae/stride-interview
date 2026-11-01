import { act, screen, waitFor, within } from "@testing-library/react";
import { APPOINTMENT_NOTES_URLS, PATIENT_URLS, PROVIDER_URLS } from "@/api/urls";
import { Toaster } from "@/components/ui/toaster";
import { api, apiPath, setupNock } from "@/test/nock";
import { renderWithProviders } from "@/test/render";
import type { TAppointment } from "@/utils/types/appointment";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import type { TProvider } from "@/utils/types/provider";
import { AppointmentDetailsDrawer } from "./AppointmentDetailsDrawer";

setupNock();

const APPOINTMENT: TAppointment = {
  id: "1",
  patientId: "1",
  providerId: "1",
  // Midday UTC so displayed dates are the same in any US timezone
  startTime: "2025-02-14T16:00:00.000Z",
  endTime: "2025-02-14T17:00:00.000Z",
  type: "Initial Evaluation",
  status: "Checked In",
  createdAt: "",
};

const PROVIDERS: TProvider[] = [
  { id: "1", firstName: "Quinten", lastName: "Walker", createdAt: "" },
];

const note = (overrides: Partial<TAppointmentNotes>): TAppointmentNotes => ({
  id: "1",
  appointmentId: "1",
  createdAt: "2025-01-30T16:00:00.000Z",
  chiefComplaint: "Broken toe",
  treatmentPlan: "Toe exercises",
  progress: "Incomplete",
  ...overrides,
});

// Deliberately out of order: notes are shown oldest first
const NOTES = [
  note({ id: "2", createdAt: "2025-02-20T16:00:00.000Z", chiefComplaint: "Sore heel" }),
  note({ id: "1" }),
];

const NOTES_PATH = apiPath(APPOINTMENT_NOTES_URLS.LIST("1", "1"));

interface TMockOptions {
  appointment?: [number, unknown];
  notes?: TAppointmentNotes[] | null;
}

/** The three requests the drawer makes when opened (notes: null = mockapi's 404 for none) */
function mockOpen({ appointment = [200, APPOINTMENT], notes = NOTES }: TMockOptions = {}) {
  api().get(apiPath(PATIENT_URLS.APPOINTMENT_DETAILS("1", "1"))).reply(...appointment);
  if (notes) api().get(NOTES_PATH).reply(200, notes);
  else api().get(NOTES_PATH).reply(404, "Not found");
  api().get(apiPath(PROVIDER_URLS.FETCH_LIST)).reply(200, PROVIDERS);
}

/** Renders the date-cell trigger; Toaster's mount update is flushed inside act() */
async function renderDrawer() {
  const result = renderWithProviders(
    <>
      <AppointmentDetailsDrawer patientId="1" appointment={APPOINTMENT} />
      <Toaster />
    </>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return result;
}

type TUser = Awaited<ReturnType<typeof renderDrawer>>["user"];

/**
 * Finds a note dialog once it's ready to use. It opens on top of the drawer, and
 * for a moment Chakra is still moving focus in and updating which layers are
 * hidden; typing before then can fail to focus the field (seen under full-suite load).
 */
async function findReadyDialog(name: string | RegExp) {
  const dialog = await screen.findByRole("dialog", { name });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  return dialog;
}

async function openDrawer(user: TUser) {
  await user.click(screen.getByRole("button", { name: /^View appointment on Feb 14, 2025 at / }));
  return screen.findByRole("dialog", { name: "Appointment · Feb 14, 2025" });
}

describe("AppointmentDetailsDrawer", () => {
  it("gives same-day appointments distinct button names", async () => {
    const later = { ...APPOINTMENT, id: "2", startTime: "2025-02-14T19:00:00.000Z" };
    renderWithProviders(
      <>
        <AppointmentDetailsDrawer patientId="1" appointment={APPOINTMENT} />
        <AppointmentDetailsDrawer patientId="1" appointment={later} />
      </>,
    );

    const names = screen
      .getAllByRole("button", { name: /^View appointment on Feb 14, 2025 at / })
      .map((b) => b.textContent);
    expect(names).toHaveLength(2);
    expect(new Set(names).size).toBe(2);
  });

  it("fetches nothing until the date is clicked", async () => {
    const fetchSpy = jest.spyOn(globalThis, "fetch");
    try {
      await renderDrawer();

      expect(
        screen.getByRole("button", { name: /^View appointment on Feb 14, 2025 at / }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      // lazyMount: the drawer's queries don't exist until it opens
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("shows the appointment's details with the provider's name, and lets it be edited", async () => {
    mockOpen();
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);

    expect(await within(drawer).findByText("Initial Evaluation")).toBeInTheDocument();
    expect(within(drawer).getByText("Checked In")).toBeInTheDocument();
    expect(await within(drawer).findByText("Quinten Walker")).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: "Edit appointment" })).toBeInTheDocument();
  });

  it("lists notes oldest first under a 'Notes' heading with 'Add note' beside it", async () => {
    mockOpen();
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);
    const notes = await within(drawer).findByRole("region", { name: "Notes" });

    expect(within(notes).getByRole("heading", { level: 2, name: "Notes" })).toBeInTheDocument();
    expect(within(notes).getByRole("button", { name: "Add note" })).toBeInTheDocument();
    const articles = await within(notes).findAllByRole("article");
    expect(
      articles.map((a) => within(a).getByRole("heading", { level: 3 }).textContent),
    ).toEqual(["Note 1 · Jan 30, 2025", "Note 2 · Feb 20, 2025"]);
    // Each note has its own, specifically labelled edit button
    expect(within(notes).getByRole("button", { name: "Edit Note 2 · Feb 20, 2025" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no notes", async () => {
    mockOpen({ notes: null });
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);

    expect(await within(drawer).findByText("No notes yet.")).toBeInTheDocument();
  });

  it("shows 'not found' when the appointment doesn't exist", async () => {
    mockOpen({ appointment: [404, "Not found"] });
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);

    expect(await within(drawer).findByText("Appointment not found.")).toBeInTheDocument();
  });

  it("edits a note: pre-filled dialog, PUT, closes, toast", async () => {
    mockOpen();
    let body: Record<string, unknown> | undefined;
    api()
      .put(apiPath(APPOINTMENT_NOTES_URLS.UPDATE("1", "1", "2")), (b: Record<string, unknown>) => {
        body = b;
        return true;
      })
      .reply(200, {});
    api().get(NOTES_PATH).reply(200, [NOTES[1], { ...NOTES[0], progress: "Walking again" }]);
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);
    await user.click(await within(drawer).findByRole("button", { name: "Edit Note 2 · Feb 20, 2025" }));
    const dialog = await findReadyDialog("Edit Note 2 · Feb 20, 2025");
    expect(within(dialog).getByRole("textbox", { name: /chief complaint/i })).toHaveValue("Sore heel");

    const progress = within(dialog).getByRole("textbox", { name: /progress/i });
    await user.clear(progress);
    await user.type(progress, "Walking again");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Note saved")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit Note 2 · Feb 20, 2025" })).not.toBeInTheDocument());
    expect(body).toEqual({
      chiefComplaint: "Sore heel",
      treatmentPlan: "Toe exercises",
      progress: "Walking again",
      appointmentId: "1",
    });
    expect(await within(drawer).findByText("Walking again")).toBeInTheDocument();
  });

  it("adds a note: POST, closes, and the new note is listed", async () => {
    mockOpen({ notes: null });
    api().post(NOTES_PATH).reply(201, {});
    api().get(NOTES_PATH).reply(200, [note({ id: "9", chiefComplaint: "Stiff knee" })]);
    const { user } = await renderDrawer();

    const drawer = await openDrawer(user);
    await user.click(await within(drawer).findByRole("button", { name: "Add note" }));
    const dialog = await findReadyDialog("Add note");
    await user.type(within(dialog).getByRole("textbox", { name: /chief complaint/i }), "Stiff knee");
    await user.type(within(dialog).getByRole("textbox", { name: /treatment plan/i }), "Toe exercises");
    await user.type(within(dialog).getByRole("textbox", { name: /progress/i }), "Incomplete");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Note added")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Add note" })).not.toBeInTheDocument());
    expect(within(drawer).getByRole("article", { name: "Note 1 · Jan 30, 2025" })).toHaveTextContent("Stiff knee");
  });
});
