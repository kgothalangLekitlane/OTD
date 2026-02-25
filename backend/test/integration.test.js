const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'testsecret';

  // require app after env is set so config/db.js connects to in-memory mongo
  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('Integration: auth and protected routes', () => {
  let token;
  test('register -> login -> access protected route', async () => {
    const user = { name: 'Test', email: 't@test.com', idNumber: '12345', password: 'pass123' };

    // register
    const reg = await request(app).post('/auth/register').send(user);
    expect([200,201]).toContain(reg.status);

    // login
    const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
    token = login.body.token;

    // access protected endpoint
    const res = await request(app).get('/appointments/my').set('Authorization', `Bearer ${token}`);
    expect([200,201,204,400,404]).toContain(res.status);
  }, 20000);
});
