const tarefaService = require('../services/tarefaService');
const {
  criarTarefaSchema,
  atualizarTarefaSchema,
  uuidParamSchema
} = require('../validators/tarefaValidator');

const criarTarefa = async (req, res) => {
  try {
    const validacao = criarTarefaSchema.safeParse(req.body);
    if (!validacao.success) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: validacao.error.issues.map(issue => issue.message)
      });
    }

    const tarefaCriada = await tarefaService.criarTarefa(validacao.data);
    return res.status(201).json(tarefaCriada);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
  }
};

const listarTarefas = async (req, res) => {
  try {
    const tarefas = await tarefaService.listarTarefas();
    return res.status(200).json(tarefas);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
  }
};

const buscarTarefaPorId = async (req, res) => {
  try {
    const { objectId } = req.params;
    const validacaoId = uuidParamSchema.safeParse(objectId);
    if (!validacaoId.success) {
      return res.status(400).json({
        erro: 'ID inválido',
        detalhes: validacaoId.error.issues.map(issue => issue.message)
      });
    }

    const tarefa = await tarefaService.buscarTarefaPorId(objectId);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    return res.status(200).json(tarefa);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
  }
};

const atualizarTarefa = async (req, res) => {
  try {
    const { objectId } = req.params;
    const validacaoId = uuidParamSchema.safeParse(objectId);
    if (!validacaoId.success) {
      return res.status(400).json({
        erro: 'ID inválido',
        detalhes: validacaoId.error.issues.map(issue => issue.message)
      });
    }

    const validacaoCorpo = atualizarTarefaSchema.safeParse(req.body);
    if (!validacaoCorpo.success) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: validacaoCorpo.error.issues.map(issue => issue.message)
      });
    }

    const tarefaAtualizada = await tarefaService.atualizarTarefa(objectId, validacaoCorpo.data);
    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    return res.status(200).json(tarefaAtualizada);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
  }
};

const removerTarefa = async (req, res) => {
  try {
    const { objectId } = req.params;
    const validacaoId = uuidParamSchema.safeParse(objectId);
    if (!validacaoId.success) {
      return res.status(400).json({
        erro: 'ID inválido',
        detalhes: validacaoId.error.issues.map(issue => issue.message)
      });
    }

    const removido = await tarefaService.removerTarefa(objectId);
    if (!removido) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    return res.status(200).json({ mensagem: 'Tarefa removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
  }
};

module.exports = {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  removerTarefa
};
