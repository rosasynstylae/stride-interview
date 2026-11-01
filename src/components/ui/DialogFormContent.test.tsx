import { screen } from "@testing-library/react";
import { Dialog } from "@chakra-ui/react/dialog";
import { renderWithProviders } from "@/test/render";
import { DialogFormContent } from "./DialogFormContent";

function OpenDialog({ onSubmit }: { onSubmit: React.FormEventHandler<HTMLFormElement> }) {
  return (
    <Dialog.Root open>
      <Dialog.Positioner>
        <DialogFormContent onSubmit={onSubmit}>
          <Dialog.Header>
            <Dialog.Title>Add thing</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <label>
              Name <input name="name" />
            </label>
          </Dialog.Body>
          <Dialog.Footer>
            <button type="submit">Save</button>
          </Dialog.Footer>
        </DialogFormContent>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

describe("DialogFormContent", () => {
  it("keeps the dialog role off the form, with the children inside the form", async () => {
    renderWithProviders(<OpenDialog onSubmit={(e) => e.preventDefault()} />);

    const dialog = await screen.findByRole("dialog", { name: "Add thing" });
    expect(dialog.tagName).toBe("DIV");
    const form = dialog.querySelector("form");
    expect(form).not.toBeNull();
    expect(form).toContainElement(screen.getByRole("textbox", { name: "Name" }));
    expect(form).toContainElement(screen.getByRole("button", { name: "Save" }));
    expect(form).toHaveAttribute("novalidate");
  });

  it("submits through the footer's submit button", async () => {
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    const { user } = renderWithProviders(<OpenDialog onSubmit={onSubmit} />);

    await user.click(await screen.findByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
