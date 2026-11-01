import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { PATIENT_URLS } from "../urls";
import {
  CREATE_PATIENT_APPOINTMENT_KEY,
  fetchPatientAppointmentsKey,
} from "../keys";
import type {
  TAppointment,
  TAppointmentInfo,
} from "@/utils/types/appointment";

const createPatientAppointment = (
  appointmentInfo: TAppointmentInfo,
): Promise<TAppointment> => {
  return apiAction(
    getFullUrl(PATIENT_URLS.APPOINTMENTS(appointmentInfo.patientId)),
    { method: "POST", ...handleJSONBody(appointmentInfo) },
  );
};

const useCreatePatientAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CREATE_PATIENT_APPOINTMENT_KEY,
    mutationFn: createPatientAppointment,
    // Returning the promise keeps the mutation pending until the table has refreshed
    onSuccess: (_data, { patientId }) =>
      queryClient.invalidateQueries({
        queryKey: fetchPatientAppointmentsKey(patientId),
      }),
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

export { createPatientAppointment, useCreatePatientAppointment };
