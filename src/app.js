const express = require('express');
const path = require('path');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const itemSchema = require('./schemas/itemSchema');
const makeErrorResponse = require('./errorResponse');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/items', (req, res) => {
  const items = Array.from(db.values());
  res.json(items);
});

app.post('/api/items', (req, res) => {
  try {
    const parsed = itemSchema.parse(req.body);
    for (const item of db.values()) {
      if (item.code === parsed.code) {
        return res.status(409).json(makeErrorResponse(
          409, 'Conflict',
          [{ field: 'code', code: 'DUPLICATE', message: 'Code już istnieje' }],
          'Konflikt: duplikat'
        ));
      }
    }
    if (parsed.price < 0.1) {
      return res.status(422).json(makeErrorResponse(
        422, 'Unprocessable Entity',
        [{ field: 'price', code: 'PRICE_TOO_LOW', message: 'Cena zbyt niska' }],
        'Złamanie reguły biznesowej'
      ));
    }
    const id = uuidv4();
    const item = { id, ...parsed };
    db.set(id, item);
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === 'ZodError') {
      const fieldErrors = err.errors.map(e => ({
        field: e.path.join('.') || 'body',
        code: 'INVALID_FORMAT',
        message: e.message
      }));
      return res.status(400).json(makeErrorResponse(
        400, 'Bad Request', fieldErrors, 'Błędny format danych'
      ));
    }
    console.error(err);
    return res.status(500).json(makeErrorResponse(
      500, 'Internal Server Error', [], 'Błąd serwera'
    ));
  }
});

app.get('/api/items/:id', (req, res) => {
  const item = db.get(req.params.id);
  if (!item) {
    return res.status(404).json(makeErrorResponse(
      404, 'Not Found', [], `Zasób ${req.params.id} nie znaleziony`
    ));
  }
  res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
  if (!db.has(req.params.id)) {
    return res.status(404).json(makeErrorResponse(
      404, 'Not Found', [], `Zasób ${req.params.id} nie znaleziony`
    ));
  }
  db.delete(req.params.id);
  res.status(204).send();
});

app.get('/api/protected', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json(makeErrorResponse(
      401, 'Unauthorized', [], 'Brak tokena lub nieprawidłowy token'
    ));
  }
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

module.exports = app;
