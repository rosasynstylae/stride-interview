import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { APPOINTMENT_NOTES_URLS } from "../urls";
import {
  UPDATE_APPOINTMENT_NOTES_KEY,
  fetchAppointmentNotesListKey,
} from "../keys";
import type {
  TAppointmentNotes,
  TAppointmentNotesInfo,
} from "@/utils/types/appointmentNotes";

interface TUpdateAppointmentNotesParams {
  patientId: string;
  appointmentId: string;
  notesId: string;
  notes: TAppointmentNotesInfo;
}

const updateAppointmentNotes = ({
  patientId,
  appointmentId,
  notesId,
  notes,
}: TUpdateAppointmentNotesParams): Promise<TAppointmentNotes> => {
  return apiAction(
    getFullUrl(
      APPOINTMENT_NOTES_URLS.UPDATE(patientId, appointmentId, notesId),
    ),
    { method: "PUT", ...handleJSONBody(notes) },
  );
};

const useUpdateAppointmentNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_APPOINTMENT_NOTES_KEY,
    mutationFn: updateAppointmentNotes,
    // Prefix match also refreshes the detail key; returning keeps the mutation
    // pending until the row has the saved values
    onSuccess: async (_data, { patientId, appointmentId }) => {
      await queryClient.invalidateQueries({
        queryKey: fetchAppointmentNotesListKey(patientId, appointmentId),
      });
      // The form stays open after saving, so confirm it
      toaster.create({ type: "success", title: "Note saved" });
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

export { updateAppointmentNotes, useUpdateAppointmentNotes };
