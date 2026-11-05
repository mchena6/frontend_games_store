import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Elige una puntuación.")
    .max(5, "La puntuación máxima es 5."),
  review: z.string().trim().min(1, "Escribe tu reseña."),
});
