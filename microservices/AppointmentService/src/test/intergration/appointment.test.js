const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/appointment.service", () => ({
    getAllAppointments: jest.fn().mockResolvedValue([{ appointment_id: 1 }]),
    getAppointmentsByOwnerId: jest.fn().mockResolvedValue([{ appointment_id: 2, owner_id: 42 }]),
    resolveAppointmentStatus: jest.fn((status) => status),
  }));

  return require("../../app").default;
}

describe("AppointmentService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3005";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "AppointmentService",
      status: "ok",
      port: 3005,
    });
  });

  it("rejects requests without gateway identity headers", async () => {
    const response = await request(app).get("/appointments").expect(401);

    expect(response.body).toEqual({ success: false, message: "Unauthorized" });
  });

  it("returns customer appointments for customer identity", async () => {
    const response = await request(app)
      .get("/appointments")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: "Appointments retrieved",
      data: [{ appointment_id: 2, owner_id: 42 }],
    });
  });
});
