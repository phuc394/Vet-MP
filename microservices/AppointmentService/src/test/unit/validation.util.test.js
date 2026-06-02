const { parseTime, parseOptionalTime } = require("../../utils/validation.util");

describe("validation util time parsing", () => {
  it("accepts HH:mm and normalizes it for MySQL TIME columns", () => {
    expect(parseTime("09:30", "start_time")).toBe("09:30:00");
  });

  it("accepts HH:mm:ss time values", () => {
    expect(parseTime("13:45:20", "end_time")).toBe("13:45:20");
  });

  it("accepts legacy date-time values and extracts the time without timezone shifting", () => {
    expect(parseTime("2026-06-03T08:30:00.000Z", "start_time")).toBe("08:30:00");
  });

  it("rejects invalid time values", () => {
    expect(() => parseTime("25:00", "start_time")).toThrow("start_time must be a valid time");
  });

  it("allows empty optional time values", () => {
    expect(parseOptionalTime("", "start_time")).toBeUndefined();
  });
});
