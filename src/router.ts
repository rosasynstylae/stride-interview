import { createBrowserRouter } from "react-router";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const AppointmentList = lazy(() => import("@/pages/AppointmentList"));
const PatientListPage = lazy(() => import("@/pages/patient_list/PatientListPage"));
const PatientDetailsPage = lazy(
  () => import("@/pages/patient_details/PatientDetailsPage"),
);

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "appointments", Component: AppointmentList },
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
