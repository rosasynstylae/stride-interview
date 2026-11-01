import { useQuery } from "@tanstack/react-query";
import { APIError, apiAction, getFullUrl } from "../api";
import { APPOINTMENT_NOTES_URLS } from "../urls";
import { fetchAppointmentNotesListKey } from "../keys";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";

const fetchAppointmentNotesList = async (
  patientId: string,
  appointmentId: string,
): Promise<TAppointmentNotes[]> => {
  try {
    return await apiAction(
      getFullUrl(APPOINTMENT_NOTES_URLS.LIST(patientId, appointmentId)),
      { method: "GET" },
    );
  } catch (error) {
    // mockapi responds 404 "Not found" when an appointment has no notes
    if (error instanceof APIError && error.status === 404) return [];
    throw error;
  }
};

const useFetchAppointmentNotesList = (
  patientId: string,
  appointmentId: string,
) =>
  useQuery({
    queryKey: fetchAppointmentNotesListKey(patientId, appointmentId),
    queryFn: () => fetchAppointmentNotesList(patientId, appointmentId),
  });

export { fetchAppointmentNotesList, useFetchAppointmentNotesList };
