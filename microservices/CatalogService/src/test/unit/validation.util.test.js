const {
  parseBoolean,
  parseId,
  parseOptionalString,
  parseString,
} = require("../../utils/validation.util");

describe("CatalogService validation utilities", () => {
  it("parses positive integer ids", () => {
    expect(parseId("12", "id")).toBe(12);
  });

  it("rejects invalid ids with HttpError metadata", () => {
    expect(() => parseId("0", "id")).toThrow("id must be a positive integer");
  });

  it("trims required strings", () => {
    expect(parseString("  Grooming  ", "name")).toBe("Grooming");
  });

  it("parses optional strings and booleans", () => {
    expect(parseOptionalString("", "description")).toBeUndefined();
    expect(parseBoolean("true", "is_active")).toBe(true);
  });
});
