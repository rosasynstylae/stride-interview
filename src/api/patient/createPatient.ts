import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { apiAction, getFullUrl, handleJSONBody } from "../api";
import { PATIENT_URLS } from "../urls";
import { CREATE_PATIENT_KEY, FETCH_PATIENT_LIST_KEY } from "../keys";
import type { TPatient, TPatientInfo } from "@/utils/types/patient";

interface TCreatePatientParams {
  patientInfo: TPatientInfo;
}

const createPatient = ({
  patientInfo,
}: TCreatePatientParams): Promise<TPatient[]> => {
  return apiAction(getFullUrl(PATIENT_URLS.CREATE), {
    method: "POST",
    ...handleJSONBody(patientInfo),
  });
};

const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CREATE_PATIENT_KEY,
    mutationFn: createPatient,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FETCH_PATIENT_LIST_KEY });
    },
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

export { createPatient, useCreatePatient };
