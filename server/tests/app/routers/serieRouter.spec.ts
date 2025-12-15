import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
// Mocks para el modelo Series
var mockFindOne: any;
var mockFind: any;
var mockFindOneAndDelete: any;
var mockSave: any;
vi.mock('../../../src/app/models/serieModel.js', () => {
  mockFindOne = vi.fn();
  mockFind = vi.fn();
  mockFindOneAndDelete = vi.fn();
  mockSave = vi.fn().mockResolvedValue(true);
  function Series(this: any, data: any) {
    this.data = data;
    this.save = mockSave;
  }
  (Series as any).findOne = mockFindOne;
  (Series as any).find = mockFind;
  (Series as any).findOneAndDelete = mockFindOneAndDelete;
  return { Series };
});
// Mocks para utils.tcgdex y dataclassToDict
var mockGet: any;
var mockDataclassToDict: any;
vi.mock('../../../src/app/utils/utils.js', () => {
  mockGet = vi.fn();
  mockDataclassToDict = vi.fn();
  return {
    tcgdex: { serie: { get: mockGet } },
    dataclassToDict: mockDataclassToDict,
  };
});
// Importar después de establecer los mocks
import { serieRouter } from '../../../src/app/routers/serieRouter';
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(serieRouter);
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
describe('serieRouter', () => {
  it('POST /series returns 400 when id is missing', async () => {
    const app = createApp();
    const res = await request(app).post('/series').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'ID is required');
  });
  it('POST /series returns 200 when serie already exists', async () => {
    mockFindOne.mockResolvedValue({ id: 'abc' });
    const app = createApp();
    const res = await request(app).post('/series').send({ id: 'abc' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Serie with this ID already exists');
    expect(mockFindOne).toHaveBeenCalledWith({ id: 'abc' });
  });
  it('POST /series creates a new serie when not existing', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const serieDict = { id: 'new', name: 'New Serie' };
    mockDataclassToDict.mockReturnValue(serieDict);
    const app = createApp();
    const res = await request(app).post('/series').send({ id: 'new' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Serie created successfully');
    expect(mockSave).toHaveBeenCalled();
  });
  it('GET /series/:_id returns 404 when not found', async () => {
    mockFindOne.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get('/series/123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Serie not found');
  });
  it('GET /series returns list of series', async () => {
    const series = [{ id: 'a' }, { id: 'b' }];
    mockFind.mockResolvedValue(series);
    const app = createApp();
    const res = await request(app).get('/series');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(series);
  });
  it('DELETE /series/:id returns 404 when no serie to delete', async () => {
    mockFindOneAndDelete.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).delete('/series/123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Serie not found');
  });
  it('DELETE /series/:id deletes and returns 200 when found', async () => {
    const deleted = { _id: '123', id: 'abc' };
    mockFindOneAndDelete.mockResolvedValue(deleted);
    const app = createApp();
    const res = await request(app).delete('/series/123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Serie deleted successfully');
    expect(res.body).toHaveProperty('deletedSerie');
  });

  it('POST /series handles duplicate key error (code 11000)', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const serieDict = { id: 'duplicate', name: 'Duplicate Serie' };
    mockDataclassToDict.mockReturnValue(serieDict);
    mockSave.mockRejectedValue({ code: 11000 });
    const app = createApp();
    const res = await request(app).post('/series').send({ id: 'duplicate' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Serie with this ID already exists');
  });

  it('POST /series handles generic error', async () => {
    mockFindOne.mockResolvedValue(null);
    const apiResponse = { some: 'response' };
    mockGet.mockResolvedValue(apiResponse);
    const serieDict = { id: 'error', name: 'Error Serie' };
    mockDataclassToDict.mockReturnValue(serieDict);
    mockSave.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).post('/series').send({ id: 'error' });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error creating serie');
  });

  it('GET /series/:_id returns 200 when serie found', async () => {
    const serie = { _id: '123', id: 'abc', name: 'Test Serie' };
    mockFindOne.mockResolvedValue(serie);
    const app = createApp();
    const res = await request(app).get('/series/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(serie);
  });

  it('GET /series/:_id handles error', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/series/123');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving serie');
  });

  it('GET /series with name filter', async () => {
    const series = [{ id: 'a', name: 'Test' }];
    mockFind.mockResolvedValue(series);
    const app = createApp();
    const res = await request(app).get('/series?name=Test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(series);
    expect(mockFind).toHaveBeenCalledWith({ name: 'Test' });
  });

  it('GET /series handles error', async () => {
    mockFind.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/series');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving series');
  });

  it('GET /series/:id returns 404 when not found by id field', async () => {
    mockFindOne.mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get('/series/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Serie not found');
  });

  it('GET /series/:id returns 200 when found by id field', async () => {
    const serie = { _id: '123', id: 'abc123', name: 'Test Serie' };
    mockFindOne.mockResolvedValue(serie);
    const app = createApp();
    const res = await request(app).get('/series/abc123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(serie);
  });

  it('GET /series/:id handles error', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).get('/series/abc');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error retrieving serie');
  });

  it('DELETE /series/:id handles error', async () => {
    mockFindOneAndDelete.mockRejectedValue(new Error('Database error'));
    const app = createApp();
    const res = await request(app).delete('/series/123');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error deleting serie');
  });
});
