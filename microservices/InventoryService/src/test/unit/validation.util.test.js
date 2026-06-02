const {
  parseId,
  parseNumber,
  parseOptionalNumber,
  parseOptionalString,
} = require("../../utils/validation.util");

describe("InventoryService validation utilities", () => {
  it("parses ids and numbers", () => {
    expect(parseId("5", "id")).toBe(5);
    expect(parseNumber("12.5", "price")).toBe(12.5);
  });

  it("returns undefined for empty optional values", () => {
    expect(parseOptionalString("", "name")).toBeUndefined();
    expect(parseOptionalNumber("", "quantity")).toBeUndefined();
  });

  it("rejects invalid numbers", () => {
    expect(() => parseNumber("abc", "quantity")).toThrow("quantity must be a number");
  });
});
