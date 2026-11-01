import { useEffect, useRef } from "react";
import { addHour } from "@/utils/addHour";
import { addMinutes, minutesBetween } from "@/utils/addMinutes";
import { shiftDate } from "@/utils/shiftDate";
import { toLocalISODate } from "@/utils/toLocalISODate";

type TDateTimeField = "startDate" | "startTime" | "endDate" | "endTime";

// Just the parts of useForm's return this needs, so any form with these fields fits
interface TEndSyncForm {
  watch: (callback: (values: unknown, info: { name?: string }) => void) => {
    unsubscribe: () => void;
  };
  getValues: (name: TDateTimeField) => string;
  setValue: (
    name: "endDate" | "endTime",
    value: string,
    options?: { shouldDirty?: boolean },
  ) => void;
  trigger: (name: "endTime") => Promise<boolean>;
  getFieldState: (name: "endTime") => { isTouched: boolean };
}

// Only act on complete values; a time input can report partial ones while typing
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v: string) => /^\d{2}:\d{2}$/.test(v);

/**
 * Keeps the end of an appointment in step with its start:
 * - changing the start date always moves the end date by the same number of
 *   days (the end time is kept), so the appointment keeps its length; an empty
 *   end date is filled with the start date;
 * - changing the start time moves the end by the same amount (09:00–10:30 →
 *   start 09:30 gives an 11:00 end), moving the end date if that crosses
 *   midnight; with no end time yet, it's filled with one hour after the start
 *   (moving an empty or same-day end date to the next day past midnight);
 * - changing any start/end field re-checks "End must be after start" once the
 *   end time has been touched (otherwise only the edited field is validated).
 */
const useAppointmentEndSync = ({
  watch,
  getValues,
  setValue,
  trigger,
  getFieldState,
}: TEndSyncForm) => {
  // The last complete start date, to know how far a change moved it
  const previousStartDate = useRef<string | null>(null);
  // Likewise the last complete start time
  const previousStartTime = useRef<string | null>(null);

  useEffect(() => {
    previousStartDate.current = getValues("startDate");
    previousStartTime.current = getValues("startTime");

    const subscription = watch((_values, { name }) => {
      if (name === "startDate") {
        const startDate = getValues("startDate");
        // Only complete dates count: clearing the field and picking a new date
        // still shifts the end relative to the last real start date
        if (isDate(startDate)) {
          const before = previousStartDate.current ?? "";
          previousStartDate.current = startDate;
          const endDate = getValues("endDate");
          if (isDate(endDate) && isDate(before)) {
            // Same number of days later as before, so the length is unchanged
            setValue("endDate", shiftDate(endDate, before, startDate), { shouldDirty: true });
          } else if (!endDate) {
            setValue("endDate", startDate, { shouldDirty: true });
          }
        }
      }

      if (name === "startTime") {
        const startTime = getValues("startTime");
        if (isTime(startTime)) {
          const before = previousStartTime.current ?? "";
          previousStartTime.current = startTime;
          const startDate = getValues("startDate");
          const endDate = getValues("endDate");
          const endTime = getValues("endTime");
          if (isTime(before) && isDate(startDate) && isDate(endDate) && isTime(endTime)) {
            // Same number of minutes later as before, so the length is unchanged
            const delta = minutesBetween(
              { date: startDate, time: before },
              { date: startDate, time: startTime },
            );
            const end = addMinutes(endDate, endTime, delta);
            if (end.date !== endDate) setValue("endDate", end.date, { shouldDirty: true });
            setValue("endTime", end.time, { shouldDirty: true });
          } else if (!endTime) {
            const next = addHour(isDate(startDate) ? startDate : toLocalISODate(), startTime);
            setValue("endTime", next.time, { shouldDirty: true });

            // 23:30 + 1h is 00:30 the next day: move the end date too, unless the
            // user already chose a different one
            if (isDate(startDate) && next.date !== startDate && (!endDate || endDate === startDate)) {
              setValue("endDate", next.date, { shouldDirty: true });
            }
          }
        }
      }

      if (
        (name === "startDate" || name === "startTime" || name === "endDate") &&
        getFieldState("endTime").isTouched
      ) {
        void trigger("endTime");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, setValue, trigger, getFieldState]);
};

export { useAppointmentEndSync };
