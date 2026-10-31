import { useQuery } from "@tanstack/react-query";
import { APIError, apiAction, getFullUrl } from "../api";
import { PATIENT_URLS } from "../urls";
import { fetchPatientAppointmentsKey } from "../keys";
import type { TAppointment } from "@/utils/types/appointment";

const fetchPatientAppointmentList = async (
  id: string,
): Promise<TAppointment[]> => {
  try {
    return await apiAction(getFullUrl(PATIENT_URLS.APPOINTMENTS(id)), {
      method: "GET",
    });
  } catch (error) {
    // mockapi responds 404 "Not found" when a patient has no appointments
    if (error instanceof APIError && error.status === 404) return [];
    throw error;
  }
};

const useFetchPatientAppointmentList = (id: string) =>
  useQuery({
    queryKey: fetchPatientAppointmentsKey(id),
    queryFn: () => fetchPatientAppointmentList(id),
  });

export { fetchPatientAppointmentList, useFetchPatientAppointmentList };
