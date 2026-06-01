const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/supplier.service", () => ({
    getAllSuppliers: jest.fn().mockResolvedValue([{ supplier_id: 1, name: "Main Supplier" }]),
  }));
  jest.doMock("../../services/medicine-inventory.service", () => ({
    getAllMedicineInventory: jest.fn().mockResolvedValue([]),
  }));
  jest.doMock("../../services/inventory-transaction.service", () => ({
    getAllInventoryTransactions: jest.fn().mockResolvedValue([]),
  }));

  return require("../../app").default;
}

describe("InventoryService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3004";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "InventoryService",
      status: "ok",
      port: 3004,
    });
  });

  it("rejects requests without gateway identity headers", async () => {
    const response = await request(app).get("/suppliers").expect(401);

    expect(response.body).toEqual({ success: false, message: "Unauthorized" });
  });

  it("blocks non-admin users", async () => {
    const response = await request(app)
      .get("/suppliers")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(403);

    expect(response.body).toEqual({ success: false, message: "Forbidden" });
  });

  it("allows admins to list suppliers", async () => {
    const response = await request(app)
      .get("/suppliers")
      .set("X-User-Id", "1")
      .set("X-User-Role", "admin")
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: "Suppliers retrieved",
      data: [{ supplier_id: 1, name: "Main Supplier" }],
    });
  });
});
