import { appointmentSchema } from "./appointmentSchema";

const valid = {
  startDate: "2025-02-14",
  startTime: "09:00",
  endDate: "2025-02-14",
  endTime: "10:00",
  type: "Follow Up",
  status: "Scheduled",
  providerId: "1",
};

const errorsFor = (values: Record<string, string>) =>
  appointmentSchema.safeParse(values).error?.issues.map((i) => `${i.path.join(".")}: ${i.message}`) ??
  [];

describe("appointmentSchema", () => {
  it("accepts an end later the same day", () => {
    expect(errorsFor(valid)).toEqual([]);
  });

  it("accepts an end on a later day, even at an earlier clock time", () => {
    expect(errorsFor({ ...valid, startTime: "23:00", endDate: "2025-02-15", endTime: "00:30" })).toEqual([]);
  });

  it.each([
    ["equal to the start", { endTime: "09:00" }],
    ["earlier the same day", { endTime: "08:30" }],
    ["on an earlier day", { endDate: "2025-02-13", endTime: "23:00" }],
  ])("rejects an end %s, on the end time field", (_label, end) => {
    expect(errorsFor({ ...valid, ...end })).toEqual(["endTime: End must be after start"]);
  });

  it("still checks the order when another field is invalid", () => {
    expect(errorsFor({ ...valid, type: "", endTime: "08:00" })).toEqual([
      "type: Choose a type",
      "endTime: End must be after start",
    ]);
  });

  it("requires both dates", () => {
    expect(errorsFor({ ...valid, startDate: "", endDate: "" })).toEqual([
      "startDate: Enter a start date",
      "endDate: Enter an end date",
    ]);
  });
});
