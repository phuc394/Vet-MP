const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/service.service", () => ({
    getAllServices: jest.fn().mockResolvedValue([{ service_id: 1, name: "Checkup" }]),
    createService: jest.fn().mockResolvedValue({ service_id: 2, name: "Bath" }),
  }));
  jest.doMock("../../services/medicine.service", () => ({
    getAllMedicines: jest.fn().mockResolvedValue([]),
  }));

  return require("../../app").default;
}

describe("CatalogService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3003";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "CatalogService",
      status: "ok",
      port: 3003,
    });
  });

  it("allows customers to list catalog services", async () => {
    const response = await request(app)
      .get("/catalog/services")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: "Services retrieved",
      data: [{ service_id: 1, name: "Checkup" }],
    });
  });

  it("blocks customers from creating catalog services", async () => {
    const response = await request(app)
      .post("/catalog/services")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .send({ name: "Bath", price: 20, is_active: true })
      .expect(403);

    expect(response.body).toEqual({ success: false, message: "Forbidden" });
  });
});
