const Tarefa = require('../models/tarefa');

const criarTarefa = async (dados) => {
  const novaTarefa = await Tarefa.create(dados);
  return novaTarefa;
};

const listarTarefas = async () => {
  const tarefas = await Tarefa.findAll({
    order: [['createdAt', 'DESC']]
  });
  return tarefas;
};

const buscarTarefaPorId = async (objectId) => {
  const tarefa = await Tarefa.findByPk(objectId);
  return tarefa;
};

const atualizarTarefa = async (objectId, dados) => {
  const tarefa = await Tarefa.findByPk(objectId);
  if (!tarefa) {
    return null;
  }

  await tarefa.update(dados);
  return tarefa;
};

const removerTarefa = async (objectId) => {
  const tarefa = await Tarefa.findByPk(objectId);
  if (!tarefa) {
    return false;
  }

  await tarefa.destroy();
  return true;
};

module.exports = {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  removerTarefa
};
