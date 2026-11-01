import { fireEvent, screen, waitFor } from "@testing-library/react";
import { FormProvider } from "react-hook-form";
import { renderWithProviders } from "@/test/render";
import { AppointmentForm } from "./AppointmentForm";
import type { TAppointmentFormValues } from "./types";
import { APPOINTMENT_FORM_DEFAULT_VALUES } from "./appointmentSchema";
import { useAppointmentForm } from "./useAppointmentForm";

/** The real appointment form; useAppointmentForm wires in useAppointmentEndSync */
function Harness({ defaultValues }: { defaultValues?: TAppointmentFormValues }) {
  const { submitForm, ...form } = useAppointmentForm({ defaultValues, onSubmit: () => {} });
  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => void submitForm(e)} noValidate>
        <AppointmentForm providers={[{ label: "Quinten Walker", value: "1" }]} />
      </form>
    </FormProvider>
  );
}

const startDate = () => screen.getByRole("textbox", { name: /start date/i });
const endDate = () => screen.getByRole("textbox", { name: /end date/i });
const startTime = () => screen.getByLabelText(/start time/i);
const endTime = () => screen.getByLabelText(/end time/i);

// <input type="time"> only takes complete values, so set them in one change
const setTime = (input: HTMLElement, value: string) => {
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
};

async function typeDate(user: ReturnType<typeof renderWithProviders>["user"], input: HTMLElement, value: string) {
  await user.clear(input);
  await user.type(input, value);
  await user.keyboard("{Enter}");
}

describe("useAppointmentEndSync", () => {
  it("fills an empty end date with the start date", async () => {
    const { user } = renderWithProviders(<Harness />);

    await typeDate(user, startDate(), "02/14/2025");

    await waitFor(() => expect(endDate()).toHaveValue("02/14/2025"));
  });

  it("fills an empty end time with an hour after the start time", async () => {
    const { user } = renderWithProviders(<Harness />);

    await typeDate(user, startDate(), "02/14/2025");
    setTime(startTime(), "09:15");

    await waitFor(() => expect(endTime()).toHaveValue("10:15"));
    expect(endDate()).toHaveValue("02/14/2025");
  });

  it("moves the end to the next day when start + 1 hour crosses midnight", async () => {
    const { user } = renderWithProviders(<Harness />);

    await typeDate(user, startDate(), "02/14/2025");
    setTime(startTime(), "23:30");

    await waitFor(() => expect(endTime()).toHaveValue("00:30"));
    expect(endDate()).toHaveValue("02/15/2025");
  });

  // A saved multi-day appointment: Feb 14 09:00 → Feb 20 17:00
  const MULTI_DAY: TAppointmentFormValues = {
    ...APPOINTMENT_FORM_DEFAULT_VALUES,
    startDate: "2025-02-14",
    startTime: "09:00",
    endDate: "2025-02-20",
    endTime: "17:00",
  };

  it("moves the end by the same number of days when the start date changes", async () => {
    const { user } = renderWithProviders(<Harness defaultValues={MULTI_DAY} />);

    // 4 days earlier...
    await typeDate(user, startDate(), "02/10/2025");
    await waitFor(() => expect(endDate()).toHaveValue("02/16/2025"));
    expect(endTime()).toHaveValue("17:00");

    // ...then 5 days later than that: still 6 days 8 hours long
    await typeDate(user, startDate(), "02/15/2025");
    await waitFor(() => expect(endDate()).toHaveValue("02/21/2025"));
    expect(endTime()).toHaveValue("17:00");
  });

  it("shifts relative to the last real start date after the field is cleared", async () => {
    const { user } = renderWithProviders(<Harness defaultValues={MULTI_DAY} />);

    await user.clear(startDate());
    await user.tab();
    await typeDate(user, startDate(), "02/16/2025");

    // Feb 14 → Feb 16 is +2 days, so the end goes Feb 20 → Feb 22
    await waitFor(() => expect(endDate()).toHaveValue("02/22/2025"));
  });

  it("moves an existing end by the same amount when the start time changes", async () => {
    renderWithProviders(<Harness defaultValues={MULTI_DAY} />);

    setTime(startTime(), "08:00");

    await waitFor(() => expect(endTime()).toHaveValue("16:00"));
    expect(endDate()).toHaveValue("02/20/2025");
  });

  it("keeps a same-day appointment's length when the start time changes", async () => {
    renderWithProviders(
      <Harness
        defaultValues={{
          ...APPOINTMENT_FORM_DEFAULT_VALUES,
          startDate: "2025-02-14",
          startTime: "09:00",
          endDate: "2025-02-14",
          endTime: "10:30",
        }}
      />,
    );

    setTime(startTime(), "09:30");

    await waitFor(() => expect(endTime()).toHaveValue("11:00"));
    expect(endDate()).toHaveValue("02/14/2025");
  });

  it("moves the end date when the shifted end crosses midnight", async () => {
    renderWithProviders(
      <Harness
        defaultValues={{
          ...APPOINTMENT_FORM_DEFAULT_VALUES,
          startDate: "2025-02-14",
          startTime: "22:00",
          endDate: "2025-02-14",
          endTime: "23:30",
        }}
      />,
    );

    setTime(startTime(), "23:00");

    await waitFor(() => expect(endTime()).toHaveValue("00:30"));
    await waitFor(() => expect(endDate()).toHaveValue("02/15/2025"));
  });

  it("re-checks a touched end when a new start time is after it", async () => {
    renderWithProviders(
      <Harness
        defaultValues={{
          ...APPOINTMENT_FORM_DEFAULT_VALUES,
          startDate: "2025-02-14",
          endDate: "2025-02-14",
          endTime: "10:00",
        }}
      />,
    );

    // Touch the end (no error: it's after the start)...
    setTime(endTime(), "10:00");
    expect(screen.queryByText("End must be after start")).not.toBeInTheDocument();

    // ...then give a start after it (with no previous start time there's nothing to shift by)
    setTime(startTime(), "11:00");

    expect(await screen.findByText("End must be after start")).toBeInTheDocument();
  });
});
