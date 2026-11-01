import { useQuery } from "@tanstack/react-query";
import { APIError, apiAction, getFullUrl } from "../api";
import { PATIENT_URLS } from "../urls";
import { fetchPatientAppointmentKey } from "../keys";
import type { TAppointment } from "@/utils/types/appointment";

const fetchPatientAppointment = (
  patientId: string,
  appointmentId: string,
): Promise<TAppointment> => {
  return apiAction(
    getFullUrl(PATIENT_URLS.APPOINTMENT_DETAILS(patientId, appointmentId)),
    { method: "GET" },
  );
};

const useFetchPatientAppointment = (patientId: string, appointmentId: string) =>
  useQuery({
    queryKey: fetchPatientAppointmentKey(patientId, appointmentId),
    queryFn: () => fetchPatientAppointment(patientId, appointmentId),
    // A missing appointment (or one belonging to another patient) won't appear on retry
    retry: (failureCount, error) =>
      !(error instanceof APIError && error.status === 404) && failureCount < 3,
  });

export { fetchPatientAppointment, useFetchPatientAppointment };
