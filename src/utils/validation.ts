import { z } from 'zod';

export const saleSchema = z.object({
  clientName: z.string().min(3, "Nome do cliente deve ter pelo menos 3 caracteres"),
  value: z.number().positive("O valor deve ser positivo"),
  stage: z.enum(['cadastro', 'negociacao', 'fechamento', 'acompanhamento']),
  salespersonId: z.number(),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
});

export type SaleInput = z.infer<typeof saleSchema>;
