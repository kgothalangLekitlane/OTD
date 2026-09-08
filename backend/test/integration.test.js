const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = "test-secret-for-otd";
  process.env.AUTH_RATE_LIMIT_MAX = "1000";
  process.env.RATE_LIMIT_MAX = "1000";
  app = require("../server");
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

async function register(user) {
  return request(app).post("/auth/register").send(user);
}

async function login(email, password) {
  const response = await request(app).post("/auth/login").send({ email, password });
  return response;
}

describe("Integration: authentication and authorization", () => {
  test("registration never accepts a privileged role", async () => {
    const response = await register({
      name: "Test Driver",
      email: "driver@test.com",
      idNumber: "DRV-001",
      password: "password123",
      role: "admin"
    });

    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("driver");
  });

  test("invalid login returns a generic 401 response", async () => {
    await register({
      name: "Test Driver",
      email: "driver@test.com",
      idNumber: "DRV-002",
      password: "password123"
    });

    const response = await login("driver@test.com", "wrong-password");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
    expect(response.body).not.toHaveProperty("password");
  });

  test("protected endpoints reject missing, malformed and expired tokens", async () => {
    const missing = await request(app).get("/appointments/my");
    expect(missing.status).toBe(401);

    const malformed = await request(app)
      .get("/appointments/my")
      .set("Authorization", "Bearer not-a-real-token");
    expect(malformed.status).toBe(401);

    const expiredToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: -1, algorithm: "HS256" }
    );
    const expired = await request(app)
      .get("/appointments/my")
      .set("Authorization", `Bearer ${expiredToken}`);
    expect(expired.status).toBe(401);
  });

  test("driver cannot use officer-only license lookup", async () => {
    const user = {
      name: "Driver",
      email: "driver@test.com",
      idNumber: "DRV-003",
      password: "password123"
    };
    await register(user);
    const loginResponse = await login(user.email, user.password);

    const response = await request(app)
      .get("/license/lookup/DRV-003")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(403);
  });

  test("fine payment is scoped to the authenticated user", async () => {
    const User = require("../models/User");
    const Fine = require("../models/Fine");

    const driverA = await User.create({
      name: "Driver A",
      email: "a@test.com",
      idNumber: "DRV-A",
      password: "password123",
      role: "driver"
    });
    const driverB = await User.create({
      name: "Driver B",
      email: "b@test.com",
      idNumber: "DRV-B",
      password: "password123",
      role: "driver"
    });
    const officer = await User.create({
      name: "Officer",
      email: "officer@test.com",
      idNumber: "OFF-001",
      password: "password123",
      role: "officer"
    });

    const fine = await Fine.create({
      userId: driverA._id,
      officerId: officer._id,
      amount: 500,
      description: "Speeding"
    });

    const driverBLogin = await login(driverB.email, "password123");
    const response = await request(app)
      .post(`/fines/pay/${fine._id}`)
      .set("Authorization", `Bearer ${driverBLogin.body.token}`);

    expect(response.status).toBe(404);
    expect((await Fine.findById(fine._id)).status).toBe("unpaid");
  });

  test("fine and appointment validators reject invalid input", async () => {
    const user = {
      name: "Driver",
      email: "validator@test.com",
      idNumber: "DRV-004",
      password: "password123"
    };
    await register(user);
    const loginResponse = await login(user.email, user.password);
    const token = loginResponse.body.token;

    const badFineId = await request(app)
      .post("/fines/pay/not-an-object-id")
      .set("Authorization", `Bearer ${token}`);
    expect(badFineId.status).toBe(400);

    const badPage = await request(app)
      .get("/appointments/my?page=0&limit=101")
      .set("Authorization", `Bearer ${token}`);
    expect(badPage.status).toBe(400);

    const badAppointment = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "invalid", date: "not-a-date", time: "25:99" });
    expect(badAppointment.status).toBe(400);
  });

  test("license lookup response does not expose password data", async () => {
    const User = require("../models/User");
    const License = require("../models/License");

    const driver = await User.create({
      name: "Licensed Driver",
      email: "license@test.com",
      idNumber: "LIC-001",
      password: "password123",
      role: "driver"
    });
    await License.create({ userId: driver._id, licenseNumber: "ABC123" });

    const officer = await User.create({
      name: "Officer",
      email: "lookup@test.com",
      idNumber: "OFF-002",
      password: "password123",
      role: "officer"
    });
    const officerLogin = await login(officer.email, "password123");

    const response = await request(app)
      .get("/license/lookup/LIC-001")
      .set("Authorization", `Bearer ${officerLogin.body.token}`);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("password123");
    expect(JSON.stringify(response.body)).not.toContain("password");
  });
});
