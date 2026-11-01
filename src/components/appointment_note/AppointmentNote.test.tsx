import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import { AppointmentNote } from "./AppointmentNote";

const NOTE: TAppointmentNotes = {
  id: "1",
  appointmentId: "1",
  createdAt: "2025-01-30T16:00:00.000Z",
  chiefComplaint: "Broken toe",
  treatmentPlan: "Toe exercises\nTwice daily",
  progress: "Incomplete",
};

describe("AppointmentNote", () => {
  it("is an article named by its h3 title", () => {
    renderWithProviders(<AppointmentNote note={NOTE} title="Note 1 · Jan 30, 2025" />);

    const article = screen.getByRole("article", { name: "Note 1 · Jan 30, 2025" });
    expect(
      within(article).getByRole("heading", { level: 3, name: "Note 1 · Jan 30, 2025" }),
    ).toBeInTheDocument();
  });

  it("shows each field of the note", () => {
    renderWithProviders(<AppointmentNote note={NOTE} title="Note 1" />);

    expect(screen.getAllByRole("term").map((t) => t.textContent)).toEqual([
      "Chief complaint",
      "Treatment plan",
      "Progress",
    ]);
    expect(screen.getByText("Broken toe")).toBeInTheDocument();
    // Line breaks from the textarea are kept (rendered with white-space: pre-wrap)
    expect(screen.getByText(/Toe exercises\s+Twice daily/)).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  it("renders the header action beside the title", () => {
    renderWithProviders(
      <AppointmentNote
        note={NOTE}
        title="Note 1"
        headerAction={<button type="button">Edit Note 1</button>}
      />,
    );

    expect(
      within(screen.getByRole("article")).getByRole("button", { name: "Edit Note 1" }),
    ).toBeInTheDocument();
  });
});
