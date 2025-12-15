import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
// Mocks: deben coincidir con las rutas que usa el módulo `setRouter.ts`.
var mockFindOne: any;
var mockFind: any;
var mockFindOneAndDelete: any;
var mockSave: any;
vi.mock('../../../src/app/models/setModel.js', () => {
  mockFindOne = vi.fn();
  mockFind = vi.fn();
  mockFindOneAndDelete = vi.fn();
  mockSave = vi.fn().mockResolvedValue(true);
  function Sets(this: any, data: any) {
    this.data = data;
    this.save = mockSave;
  }
  (Sets as any).findOne = mockFindOne;
  (Sets as any).find = mockFind;
  (Sets as any).findOneAndDelete = mockFindOneAndDelete;
  return { Sets };
});
var mockGet: any;
var mockDataclassToDict: any;
vi.mock('../../../src/app/utils/utils.js', () => {
  mockGet = vi.fn();
  mockDataclassToDict = vi.fn();
  return {
    tcgdex: { set: { get: mockGet } },
    dataclassToDict: mockDataclassToDict,
  };
});
// Importar después de establecer los mocks
import { setRouter } from '../../../src/app/routers/setRouter';
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(setRouter);
  return app;
}
beforeEach(() => {
  mockFindOne.mockReset();
  mockFind.mockReset();
  mockFindOneAndDelete.mockReset();
  mockSave.mockReset();
  mockGet.mockReset();
  mockDataclassToDict.mockReset();
});
describe('setRouter', () => {
  it('POST /sets returns 400 when id is missing', async () => {
    const app = createApp();
    const res = await request(app).post('/sets').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'ID is required');
  });
  it('POST /sets returns 200 when set already exists', async () => {
    mockFindOne.mockResolvedValue({ id: 'abc' });
    const app = createApp();
    const res = await request(app).post('/sets').send({ id: 'abc' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Set with this ID already exists');
    expect(mockFindOne).toHaveBeenCalledWith({ id: 'abc' });
  });
  it('POST /sets creates a new set when not existing', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const setDict = { id: 'new', name: 'New Set' };
    mockDataclassToDict.mockReturnValue(setDict);
    const app = createApp();
    const res = await request(app).post('/sets').send({ id: 'new' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Set created successfully');
    // La instancia guardada debe contener los datos del set
    expect(mockSave).toHaveBeenCalled();
  });
  it('GET /sets/:_id returns 404 when not found', async () => {
    mockFindOne.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get('/sets/123');
    // Note: there are two GET routes with :_id and :id; this will match the first defined.
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Set not found');
  });
  it('GET /sets returns list of sets', async () => {
    const sets = [{ id: 'a' }, { id: 'b' }];
    mockFind.mockResolvedValue(sets);
    const app = createApp();
    const res = await request(app).get('/sets');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sets);
  });
  it('DELETE /sets/:_id returns 404 when no set to delete', async () => {
    mockFindOneAndDelete.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).delete('/sets/123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Set not found');
  });
  it('DELETE /sets/:_id deletes and returns 200 when found', async () => {
    const deleted = { _id: '123', id: 'abc' };
    mockFindOneAndDelete.mockResolvedValue(deleted);
    const app = createApp();
    const res = await request(app).delete('/sets/123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Set deleted successfully');
    expect(res.body).toHaveProperty('deletedSet');
  });

  it('POST /sets handles duplicate key error (code 11000)', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const setDict = { id: 'duplicate', name: 'Duplicate Set' };
    mockDataclassToDict.mockReturnValue(setDict);
    mockSave.mockRejectedValue({ code: 11000 });
    const app = createApp();
    const res = await request(app).post('/sets').send({ id: 'duplicate' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Set with this ID already exists');
  });

  it('POST /sets handles generic error', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const setDict = { id: 'error', name: 'Error Set' };
    mockDataclassToDict.mockReturnValue(setDict);
    mockSave.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).post('/sets').send({ id: 'error' });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error creating set');
  });

  it('GET /sets/:_id returns 200 when set found', async () => {
    const set = { _id: '123', id: 'abc', name: 'Test Set' };
    mockFindOne.mockResolvedValue(set);
    const app = createApp();
    const res = await request(app).get('/sets/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(set);
  });

  it('GET /sets/:_id handles error', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/sets/123');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving set');
  });

  it('GET /sets with name filter', async () => {
    const sets = [{ id: 'a', name: 'Test' }];
    mockFind.mockResolvedValue(sets);
    const app = createApp();
    const res = await request(app).get('/sets?name=Test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sets);
    expect(mockFind).toHaveBeenCalledWith({ name: 'Test' });
  });

  it('GET /sets handles error', async () => {
    mockFind.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/sets');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving sets');
  });

  it('GET /sets/:id returns 404 when not found by id field', async () => {
    mockFindOne.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get('/sets/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Set not found');
  });

  it('GET /sets/:id returns 200 when found by id field', async () => {
    const set = { _id: '123', id: 'abc123', name: 'Test Set' };
    mockFindOne.mockResolvedValue(set);
    const app = createApp();
    const res = await request(app).get('/sets/abc123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(set);
  });

  it('GET /sets/:id handles error', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/sets/abc');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving set');
  });

  it('DELETE /sets/:_id handles error', async () => {
    mockFindOneAndDelete.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).delete('/sets/123');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error deleting set');
  });
});
