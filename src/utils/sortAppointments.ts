import type { TAppointment } from "./types/appointment";

const appointmentSorter = (a: TAppointment, b: TAppointment) =>
  a.startTime.localeCompare(b.startTime);

const sortAppointments = (appointments: TAppointment[]): TAppointment[] =>
  appointments.toSorted(appointmentSorter);

export { appointmentSorter, sortAppointments };
