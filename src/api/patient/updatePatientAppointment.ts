import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { PATIENT_URLS } from "../urls";
import {
  UPDATE_PATIENT_APPOINTMENT_KEY,
  fetchPatientAppointmentKey,
  fetchPatientAppointmentsKey,
} from "../keys";
import type {
  TAppointment,
  TAppointmentInfo,
} from "@/utils/types/appointment";

interface TUpdatePatientAppointmentParams {
  patientId: string;
  appointmentId: string;
  appointmentInfo: TAppointmentInfo;
}

const updatePatientAppointment = ({
  patientId,
  appointmentId,
  appointmentInfo,
}: TUpdatePatientAppointmentParams): Promise<TAppointment> => {
  return apiAction(
    getFullUrl(PATIENT_URLS.APPOINTMENT_DETAILS(patientId, appointmentId)),
    { method: "PUT", ...handleJSONBody(appointmentInfo) },
  );
};

const useUpdatePatientAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_PATIENT_APPOINTMENT_KEY,
    mutationFn: updatePatientAppointment,
    // Refresh the drawer's appointment and the table. exact: both keys are
    // prefixes of the appointment's notes keys, which an edit doesn't affect.
    // Awaited so the mutation resolves once both show the saved values.
    onSuccess: async (_data, { patientId, appointmentId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: fetchPatientAppointmentKey(patientId, appointmentId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: fetchPatientAppointmentsKey(patientId),
          exact: true,
        }),
      ]);
      toaster.create({ type: "success", title: "Appointment saved" });
    },
    onError: () => {
      toaster.create({
        type: "error",
        title: "Couldn't save the appointment",
        description: "Please try again.",
        closable: true,
      });
    },
  });
};

export { updatePatientAppointment, useUpdatePatientAppointment };
