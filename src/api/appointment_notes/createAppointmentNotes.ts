import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { APPOINTMENT_NOTES_URLS } from "../urls";
import {
  CREATE_APPOINTMENT_NOTES_KEY,
  fetchAppointmentNotesListKey,
} from "../keys";
import type {
  TAppointmentNotes,
  TAppointmentNotesInfo,
} from "@/utils/types/appointmentNotes";

interface TCreateAppointmentNotesParams {
  patientId: string;
  appointmentId: string;
  notes: TAppointmentNotesInfo;
}

const createAppointmentNotes = ({
  patientId,
  appointmentId,
  notes,
}: TCreateAppointmentNotesParams): Promise<TAppointmentNotes> => {
  return apiAction(
    getFullUrl(APPOINTMENT_NOTES_URLS.CREATE(patientId, appointmentId)),
    { method: "POST", ...handleJSONBody(notes) },
  );
};

const useCreateAppointmentNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CREATE_APPOINTMENT_NOTES_KEY,
    mutationFn: createAppointmentNotes,
    // Not awaited: the refetch swaps the dialog to "edit", so let it close first
    onSuccess: (_data, { patientId, appointmentId }) => {
      void queryClient.invalidateQueries({
        queryKey: fetchAppointmentNotesListKey(patientId, appointmentId),
      });
    },
    onError: () => {
      toaster.create({
        type: "error",
        title: "Couldn't save the notes",
        description: "Please try again.",
        closable: true,
      });
    },
  });
};

export { createAppointmentNotes, useCreateAppointmentNotes };
