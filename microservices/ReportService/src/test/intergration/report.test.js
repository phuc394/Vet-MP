const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/report.service", () => ({
    getUserRoleDistribution: jest.fn().mockResolvedValue({
      labels: ["admin", "customer"],
      datasets: [{ data: [1, 5] }],
    }),
    getPetSpeciesDistribution: jest.fn().mockResolvedValue({ labels: [], datasets: [{ data: [] }] }),
    getAppointmentStatusDistribution: jest.fn().mockResolvedValue({ labels: [], datasets: [{ data: [] }] }),
    getMedicineStockLevels: jest.fn().mockResolvedValue({ labels: [], datasets: [{ data: [] }] }),
    getTopRevenueServices: jest.fn().mockResolvedValue({ labels: [], datasets: [{ data: [] }] }),
    getRevenueTrend: jest.fn().mockResolvedValue({ labels: [], datasets: [{ data: [] }] }),
    getLowStockMedicines: jest.fn().mockResolvedValue({ columns: [], rows: [] }),
    getCancelledAppointmentsWithReasons: jest.fn().mockResolvedValue({ columns: [], rows: [] }),
    calculateRevenue: jest.fn().mockResolvedValue({ totalRevenue: 0, appointmentCount: 0, averageRevenue: 0 }),
    getRevenue: jest.fn().mockResolvedValue([]),
  }));

  return require("../../app").default;
}

describe("ReportService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3007";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "ReportService",
      status: "ok",
      port: 3007,
    });
  });

  it("rejects requests without gateway identity headers", async () => {
    const response = await request(app).get("/reports/pie/auth/role").expect(401);

    expect(response.body).toEqual({ success: false, message: "Unauthorized" });
  });

  it("blocks customers from reports", async () => {
    const response = await request(app)
      .get("/reports/pie/auth/role")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(403);

    expect(response.body).toEqual({ success: false, message: "Forbidden" });
  });

  it("allows admins to read reports", async () => {
    const response = await request(app)
      .get("/reports/pie/auth/role")
      .set("X-User-Id", "1")
      .set("X-User-Role", "admin")
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: "User role distribution retrieved",
      data: {
        labels: ["admin", "customer"],
        datasets: [{ data: [1, 5] }],
      },
    });
  });
});
