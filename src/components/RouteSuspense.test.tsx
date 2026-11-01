import { lazy } from "react";
import { act, render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { RouteSuspense } from "./RouteSuspense";

describe("RouteSuspense", () => {
  it("shows an announced loading spinner while a lazy page loads, then the page", async () => {
    let resolvePage!: (mod: { default: () => React.ReactNode }) => void;
    const SlowPage = lazy(
      () => new Promise<{ default: () => React.ReactNode }>((resolve) => (resolvePage = resolve)),
    );
    const router = createMemoryRouter(
      [{ path: "/", Component: RouteSuspense, children: [{ index: true, Component: SlowPage }] }],
      { initialEntries: ["/"] },
    );

    // Not renderWithProviders: it already wraps in a MemoryRouter, and this test needs its own
    render(
      <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
      </ChakraProvider>,
    );

    expect(await screen.findByRole("status")).toHaveTextContent("Loading page");

    await act(async () => {
      resolvePage({ default: () => <h1>Loaded page</h1> });
    });

    expect(await screen.findByRole("heading", { name: "Loaded page" })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
