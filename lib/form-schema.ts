import { z } from "zod";

export const formSchema = z.object({
  database: z.string().min(1, {
    message: "Database is empty.",
  }),
  model: z.string().min(1, {
    message: "Model is empty.",
  }),
  userQuestion: z.string().min(1, {
    message: "Input query is empty.",
  }),
  temperature: z.number().min(0).max(1),
  top_p: z.number().min(0).max(1).step(0.01),
  top_k: z.number().min(0).max(500).step(10),
  maxlength: z.number().min(0).max(2048).step(10),
});
