import { useEffect } from "react";

/**
 * Only the changed field is re-validated, so moving the start time wouldn't
 * update the end time's error. Re-check it, once the user has been there.
 */
// Just the parts of useForm's return this needs, so any form with start/end times fits
interface TEndTimeForm {
  watch: (callback: (values: unknown, info: { name?: string }) => void) => {
    unsubscribe: () => void;
  };
  trigger: (name: "endTime") => Promise<boolean>;
  getFieldState: (name: "endTime") => { isTouched: boolean };
}

const useRevalidateEndTime = ({
  watch,
  trigger,
  getFieldState,
}: TEndTimeForm) => {
  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name === "startTime" && getFieldState("endTime").isTouched) {
        void trigger("endTime");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger, getFieldState]);
};

export { useRevalidateEndTime };
