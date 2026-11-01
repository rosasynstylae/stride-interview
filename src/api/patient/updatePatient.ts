import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { PATIENT_URLS } from "../urls";
import {
  FETCH_PATIENT_LIST_KEY,
  UPDATE_PATIENT_KEY,
  fetchPatientKey,
} from "../keys";
import type { TPatient, TPatientInfo } from "@/utils/types/patient";

interface TUpdatePatientParams {
  patientId: string | number;
  patientInfo: TPatientInfo;
}

const updatePatient = ({
  patientId,
  patientInfo,
}: TUpdatePatientParams): Promise<TPatient> => {
  return apiAction(getFullUrl(PATIENT_URLS.UPDATE(patientId)), {
    method: "PUT",
    ...handleJSONBody(patientInfo),
  });
};

const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_PATIENT_KEY,
    mutationFn: updatePatient,
    // exact: these keys are prefixes of the patient's appointments/notes keys,
    // which a patient edit doesn't affect. Returning keeps the mutation pending
    // until the page shows the saved values.
    onSuccess: (_data, { patientId }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: fetchPatientKey(patientId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: FETCH_PATIENT_LIST_KEY,
          exact: true,
        }),
      ]),
    onError: () => {
      toaster.create({
        type: "error",
        title: "Couldn't save the patient",
        description: "Please try again.",
        closable: true,
      });
    },
  });
};

export { updatePatient, useUpdatePatient };
