const { z } = require('zod');

const criarTarefaSchema = z.object({
  descricao: z.string({
    required_error: 'A descrição é obrigatória.',
    invalid_type_error: 'A descrição deve ser um texto.'
  }).trim().min(1, 'A descrição não pode ser vazia.'),
  concluida: z.boolean({
    invalid_type_error: 'O status de conclusão deve ser um valor booleano.'
  }).optional().default(false)
});

const atualizarTarefaSchema = z.object({
  descricao: z.string({
    invalid_type_error: 'A descrição deve ser um texto.'
  }).trim().min(1, 'A descrição não pode ser vazia.').optional(),
  concluida: z.boolean({
    invalid_type_error: 'O status de conclusão deve ser um valor booleano.'
  }).optional()
}).refine(data => data.descricao !== undefined || data.concluida !== undefined, {
  message: 'Pelo menos um dos campos (descricao ou concluida) deve ser fornecido para atualização.'
});

const uuidParamSchema = z.string().uuid({
  message: 'O objectId fornecido deve ser um UUID válido.'
});

module.exports = {
  criarTarefaSchema,
  atualizarTarefaSchema,
  uuidParamSchema
};
