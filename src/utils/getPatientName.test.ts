import { getPatientName } from "./getPatientName";

describe("getPatientName", () => {
  it("joins first and last name", () => {
    expect(getPatientName({ id: "1", firstName: "Eli", lastName: "Dicki" })).toBe("Eli Dicki");
  });

  it("leaves out an empty or blank last name", () => {
    expect(getPatientName({ id: "1", firstName: "Eli", lastName: "" })).toBe("Eli");
    expect(getPatientName({ id: "1", firstName: "Eli", lastName: "  " })).toBe("Eli");
  });

  it("trims stray whitespace around each name", () => {
    expect(getPatientName({ id: "1", firstName: " Eli ", lastName: " Dicki" })).toBe("Eli Dicki");
  });

  it("falls back to the id when neither name is set", () => {
    expect(getPatientName({ id: "7", firstName: "", lastName: "" })).toBe("Patient #7");
    expect(getPatientName({ id: 7, firstName: " ", lastName: "  " })).toBe("Patient #7");
  });
});
