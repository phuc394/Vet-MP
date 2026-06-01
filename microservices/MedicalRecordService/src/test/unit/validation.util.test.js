const {
  parseId,
  parseOptionalString,
  parseString,
} = require("../../utils/validation.util");

describe("MedicalRecordService validation utilities", () => {
  it("parses valid ids", () => {
    expect(parseId("9", "id")).toBe(9);
  });

  it("trims strings and treats blank optional strings as undefined", () => {
    expect(parseString("  diagnosis  ", "diagnosis")).toBe("diagnosis");
    expect(parseOptionalString("   ", "notes")).toBeUndefined();
  });

  it("rejects blank required strings", () => {
    expect(() => parseString("   ", "diagnosis")).toThrow("diagnosis is required");
  });
});
