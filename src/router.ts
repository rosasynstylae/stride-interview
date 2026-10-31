import { createBrowserRouter } from "react-router";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const AppointmentList = lazy(() => import("@/pages/AppointmentList"));
const PatientListPage = lazy(() => import("@/pages/patient_list/PatientListPage"));
const PatientDetails = lazy(() => import("@/pages/PatientDetails"));

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
          { path: ":id", Component: PatientDetails },
        ],
      },
    ],
  },
]);

export { router };
