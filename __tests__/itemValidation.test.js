const { z } = require('zod');
const itemSchema = require('../src/schemas/itemSchema');

test('price musi być liczbą większą od 0', () => {
  const badItem = { name: 'Test', email: 'a@b.com', price: -5, birthDate: '2000-01-01', code: 'ABCD' };
  expect(() => itemSchema.parse(badItem)).toThrow();
});

test('poprawny item przechodzi walidację', () => {
  const goodItem = { name: 'Produkt', email: 'a@b.com', price: 10, birthDate: '2000-01-01', code: 'ABCD' };
  expect(() => itemSchema.parse(goodItem)).not.toThrow();
});
