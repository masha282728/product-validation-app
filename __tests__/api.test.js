const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

beforeEach(() => {
  db.clear(); 
});

describe('API integracyjne', () => {

  test('POST /api/items z błędnymi danymi → 400', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'A', email: 'bademail', price: -5, birthDate: '3000-01-01', code: '123' })
      .set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body.fieldErrors.length).toBeGreaterThan(0);
  });

  test('POST /api/items z duplikatem → 409', async () => {
    const item = { name: 'Produkt', email: 'a@b.com', price: 10, birthDate: '2000-01-01', code: 'CODE123' };
    await request(app).post('/api/items').send(item).set('Accept', 'application/json');
    const res = await request(app).post('/api/items').send(item).set('Accept', 'application/json');
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Conflict');
  });

  test('GET /api/items/:id nieistniejącego zasobu → 404', async () => {
    const res = await request(app).get('/api/items/nonexistent-id');
    expect(res.status).toBe(404);
  });

  test('DELETE /api/items/:id nieistniejącego zasobu → 404', async () => {
    const res = await request(app).delete('/api/items/nonexistent-id');
    expect(res.status).toBe(404);
  });

  test('GET /api/protected bez tokena → 401', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.status).toBe(401);
  });

  test('GET /api/protected z tokenem → 200', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

});
