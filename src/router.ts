import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { RouteSuspense } from "@/components/RouteSuspense";

const Home = lazy(() => import("@/pages/Home"));
const AppointmentCreationPage = lazy(
  () => import("@/pages/appointment_creation/AppointmentCreationPage"),
);
const PatientListPage = lazy(
  () => import("@/pages/patient_list/PatientListPage"),
);
const PatientDetailsPage = lazy(
  () => import("@/pages/patient_details/PatientDetailsPage"),
);

const router = createBrowserRouter([
  {
    path: "/",
    // Suspense boundary for the lazy pages below
    Component: RouteSuspense,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: Home },
      {
        path: "appointments",
        Component: AppointmentCreationPage,
      },
      {
        path: "patients",
        children: [
          { index: true, Component: PatientListPage },
          { path: ":id", Component: PatientDetailsPage },
        ],
      },
    ],
  },
]);

export { router };
