const {
  validateCreatePet,
  validateUpdatePet,
  validatePetId,
  validateSearchKey,
} = require("../../utils/createPet.validate");

describe("Pet validation", () => {
  describe("validateCreatePet", () => {
    it("accepts the required create fields only", () => {
      expect(
        validateCreatePet({
          owner_id: 1,
          name: "Milo",
          sex: "male",
        })
      ).toBeNull();
    });

    it("rejects missing required create fields", () => {
      expect(validateCreatePet({ name: "Milo", sex: "male" })).toBe(
        "Missing required fields: owner_id, name, sex"
      );
    });

    it("validates optional create fields when provided", () => {
      expect(
        validateCreatePet({
          owner_id: 1,
          name: "Milo",
          sex: "male",
          weight: -1,
        })
      ).toBe("weight must be > 0");
    });

    it("rejects non-finite numeric create fields", () => {
      expect(
        validateCreatePet({
          owner_id: 1,
          name: "Milo",
          sex: "male",
          weight: Infinity,
        })
      ).toBe("weight must be a number");
    });
  });

  describe("validateUpdatePet", () => {
    it("rejects empty update payloads", () => {
      expect(validateUpdatePet({})).toBe("Invalid data format");
    });

    it("rejects invalid optional update fields", () => {
      expect(validateUpdatePet({ birth_date: "not-a-date" })).toBe(
        "birth_date must be a valid date"
      );
    });

    it("rejects empty update dates", () => {
      expect(validateUpdatePet({ birth_date: "" })).toBe(
        "birth_date must be a valid date"
      );
    });
  });

  it("validates pet ids", () => {
    expect(validatePetId(1)).toBeNull();
    expect(validatePetId(0)).toBe("pet_id must be a positive number");
  });

  it("validates search keywords", () => {
    expect(validateSearchKey("Milo")).toBeNull();
    expect(validateSearchKey(" ")).toBe("searchKey must be a non-empty string");
  });
});
