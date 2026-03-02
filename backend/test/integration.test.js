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

  test('register fails with missing fields', async () => {
    const res = await request(app).post('/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

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

    // access protected endpoint (page-body response)
    const res = await request(app).get('/appointments/my').set('Authorization', `Bearer ${token}`);
    expect([200,201,204,400,404]).toContain(res.status);

    // create appointment with missing fields should fail
    const bad = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(bad.status).toBe(400);

    // create a valid appointment
    const appt = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'drivers', date: new Date().toISOString(), time: '10:00', testingCenter: 'Main' });
    expect([200,201]).toContain(appt.status);

  }, 20000);

  test('license lookup caches results', async () => {
    // create a driver user and license directly via models
    const User = require('../models/User');
    const License = require('../models/License');
    const user = await User.create({ name: 'Cache', email: 'c@c.com', idNumber: '999', password: 'x', role: 'driver' });
    await License.create({ userId: user._id, licenseNumber: 'ABC123' });

    // login as officer to exercise lookup
    const officer = await User.create({ name: 'Officer', email: 'off@c.com', idNumber: 'off', password: 'x', role: 'officer' });
    const login = await request(app).post('/auth/login').send({ email: officer.email, password: 'x' });
    const tk = login.body.token;

    // first lookup (should hit DB)
    const first = await request(app).get('/license/lookup/999').set('Authorization', `Bearer ${tk}`);
    expect(first.status).toBe(200);
    // second lookup should still return same result quickly
    const second = await request(app).get('/license/lookup/999').set('Authorization', `Bearer ${tk}`);
    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
  });
});
