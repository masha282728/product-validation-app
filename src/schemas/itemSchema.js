const { z } = require('zod');

const itemSchema = z.object({
  name: z.string()
         .min(3, "Name: minimum 3 znaki")
         .max(50, "Name: maximum 50 znaki"),
  email: z.string()
          .email("Niepoprawny email"),
  price: z.preprocess(val => parseFloat(val), z.number().positive("Price musi być większe od 0")),
  birthDate: z.string()
              .refine(date => new Date(date) <= new Date(), {
                message: "Birth date nie może być późniejsza niż dzis."
              }),
  code: z.string()
         .min(4, "Code: minimum 4 znaki")
         .max(20, "Code: maximum 20 znaki")
         .regex(/^[A-Za-z0-9\-]+$/, "Code: tylko litery, cyfry i myślnik")
});

module.exports = itemSchema;
