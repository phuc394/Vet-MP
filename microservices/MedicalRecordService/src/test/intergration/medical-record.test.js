const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/medical-record.service", () => ({
    getAllMedicalRecords: jest.fn().mockResolvedValue([{ medical_record_id: 1 }]),
    getMedicalRecordsByOwnerId: jest.fn().mockResolvedValue([{ medical_record_id: 2, owner_id: 42 }]),
    createMedicalRecord: jest.fn().mockResolvedValue({ medical_record_id: 3, appointment_id: 10 }),
    resolveMedicalRecordStatus: jest.fn((status) => status),
  }));
  jest.doMock("../../services/prescription.service", () => ({
    getAllPrescriptions: jest.fn().mockResolvedValue([]),
  }));
  jest.doMock("../../services/re-examination.service", () => ({
    getAllReExaminations: jest.fn().mockResolvedValue([]),
  }));

  return require("../../app").default;
}

describe("MedicalRecordService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3006";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "MedicalRecordService",
      status: "ok",
      port: 3006,
    });
  });

  it("returns customer medical records for customer identity", async () => {
    const response = await request(app)
      .get("/medical-records")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: "Medical records retrieved",
      data: [{ medical_record_id: 2, owner_id: 42 }],
    });
  });

  it("blocks customers from creating medical records", async () => {
    const response = await request(app)
      .post("/medical-records")
      .set("X-User-Id", "42")
      .set("X-User-Role", "customer")
      .send({ appointment_id: 10 })
      .expect(403);

    expect(response.body).toEqual({ success: false, message: "Forbidden" });
  });
});
