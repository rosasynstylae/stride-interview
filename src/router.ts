import { createBrowserRouter } from "react-router";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const AppointmentSetUp = lazy(() => import("@/pages/AppointmentSetUp"));
const PatientList = lazy(() => import("@/pages/PatientList"));
const PatientDetails = lazy(() => import("@/pages/PatientDetails"));

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "appointment", Component: AppointmentSetUp },
      {
        path: "patient",
        children: [
          { index: true, Component: PatientList },
          { path: ":id", Component: PatientDetails },
        ],
      },
    ],
  },
]);

export { router };
