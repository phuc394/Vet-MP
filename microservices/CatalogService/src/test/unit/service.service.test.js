describe("CatalogService service model mapping", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("normalizes database is_active values to booleans", async () => {
    const query = jest.fn().mockResolvedValue([
      [
        { service_id: 1, name: "Checkup", price: "120000.00", is_active: 1 },
        { service_id: 2, name: "Dental", price: "155000.00", is_active: "0" },
        { service_id: 3, name: "Grooming", price: "190000.00", is_active: Buffer.from([1]) },
      ],
    ]);

    jest.doMock("../../config/database.config", () => ({
      __esModule: true,
      default: { query },
    }));

    const serviceModule = require("../../services/service.service");
    const services = await serviceModule.getAllServices();

    expect(query).toHaveBeenCalledWith("SELECT * FROM Service ORDER BY created_at desc");
    expect(services.map((service) => service.is_active)).toEqual([true, false, true]);
  });
});
