import { screen, waitFor, within } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router";
import { renderWithProviders } from "@/test/render";
import { HeaderBar } from "./HeaderBar";

function LocationDisplay() {
  return <p data-testid="location">{useLocation().pathname}</p>;
}

/** HeaderBar on every route, plus the current path so navigation can be asserted */
const renderHeader = (route = "/") =>
  renderWithProviders(
    <Routes>
      <Route
        path="*"
        element={
          <>
            <HeaderBar>
              <nav aria-label="breadcrumb">Breadcrumbs</nav>
            </HeaderBar>
            <LocationDisplay />
          </>
        }
      />
    </Routes>,
    { route },
  );

// By label, not role: while the modal drawer is open Chakra sets aria-hidden on the
// trigger, so it has no accessible name for getByRole to match
const menuButton = () => screen.getByLabelText("Open navigation");

describe("HeaderBar", () => {
  it("is the page's banner landmark and renders its children", () => {
    renderHeader();

    const banner = screen.getByRole("banner");
    expect(
      within(banner).getByRole("navigation", { name: "breadcrumb" }),
    ).toBeInTheDocument();
    expect(within(banner).getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
  });

  it("keeps the navigation drawer closed until the menu is opened", async () => {
    const { user } = renderHeader();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton());

    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    const nav = within(drawer).getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Home",
      "Patient List",
      "New Appointment",
    ]);
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
  });

  it("marks the current section's link as the current page", async () => {
    const { user } = renderHeader("/patients/1");

    await user.click(menuButton());
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });

    // Patient List covers /patients/*; Home only matches "/" exactly
    expect(within(drawer).getByRole("link", { name: "Patient List" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(drawer).getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      within(drawer).getByRole("link", { name: "New Appointment" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("navigates and closes the drawer when a link is chosen", async () => {
    const { user } = renderHeader("/");

    await user.click(menuButton());
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    await user.click(within(drawer).getByRole("link", { name: "New Appointment" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/appointments");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
