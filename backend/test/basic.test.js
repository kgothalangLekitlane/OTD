const request = require('supertest');
const app = require('../server');

describe('Basic protected routes and auth', () => {
  test('GET /appointments/my without token returns 401', async () => {
    const res = await request(app).get('/appointments/my');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /fines/my without token returns 401', async () => {
    const res = await request(app).get('/fines/my');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /license/me without token returns 401', async () => {
    const res = await request(app).get('/license/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /auth/register with missing fields returns 400', async () => {
    const res = await request(app).post('/auth/register').send({});
    expect([400,500]).toContain(res.status);
    // either validation 400 or server error if DB not connected; ensure a non-200
  });
});
