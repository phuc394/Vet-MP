const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/pet.service", () => ({
    getAllPets: jest.fn().mockResolvedValue([{ pet_id: 1, owner_id: 99, name: "Milo" }]),
    getPetsByOwnerId: jest.fn().mockResolvedValue([{ pet_id: 2, owner_id: 42, name: "Luna" }]),
  }));

  return require("../../app").default;
}

describe("PetService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3002";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "PetService",
      status: "ok",
      port: 3002,
    });
  });

  it("rejects requests without gateway identity headers", async () => {
    const response = await request(app).get("/api/v1/pets").expect(401);

    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("returns owner pets for customers", async () => {
    const response = await request(app)
      .get("/api/v1/pets")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(200);

    expect(response.body).toEqual({
      message: "Get pets successfully",
      data: [{ pet_id: 2, owner_id: 42, name: "Luna" }],
    });
  });
});
