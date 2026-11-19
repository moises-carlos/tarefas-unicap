const { test, before, after, describe } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
const sequelize = require('../src/config/database');
const app = require('../src/index');

describe('API de Tarefas - Testes de Integração', () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  after(async () => {
    await sequelize.close();
  });

  test('POST /tarefas - deve criar uma nova tarefa com sucesso e objectId UUID', async () => {
    const response = await request(app)
      .post('/tarefas')
      .send({
        descricao: 'Estudar Express e Sequelize',
        concluida: false
      });

    assert.equal(response.status, 201);
    assert.ok(response.body.objectId, 'Deve ter um objectId');
    assert.equal(response.body.descricao, 'Estudar Express e Sequelize');
    assert.equal(response.body.concluida, false);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.match(response.body.objectId, uuidRegex);
  });

  test('POST /tarefas - deve criar tarefa com concluida=false por padrão quando omitida', async () => {
    const response = await request(app)
      .post('/tarefas')
      .send({
        descricao: 'Fazer trabalho da UNICAP'
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.descricao, 'Fazer trabalho da UNICAP');
    assert.equal(response.body.concluida, false);
  });

  test('POST /tarefas - deve falhar com erro 400 se a descricao não for fornecida', async () => {
    const response = await request(app)
      .post('/tarefas')
      .send({
        concluida: true
      });

    assert.equal(response.status, 400);
    assert.ok(response.body.erro);
    assert.ok(Array.isArray(response.body.detalhes));
  });

  test('POST /tarefas - deve falhar com erro 400 se a descricao for vazia', async () => {
    const response = await request(app)
      .post('/tarefas')
      .send({
        descricao: '   '
      });

    assert.equal(response.status, 400);
    assert.ok(response.body.erro);
  });

  test('GET /tarefas - deve listar todas as tarefas', async () => {
    const response = await request(app).get('/tarefas');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert.equal(response.body.length, 2);
  });

  test('GET /tarefas/:objectId - deve retornar a tarefa correta pelo objectId', async () => {
    const criacao = await request(app)
      .post('/tarefas')
      .send({ descricao: 'Tarefa para busca individual' });

    const objectId = criacao.body.objectId;

    const response = await request(app).get(`/tarefas/${objectId}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.objectId, objectId);
    assert.equal(response.body.descricao, 'Tarefa para busca individual');
  });

  test('GET /tarefas/:objectId - deve retornar 404 se a tarefa não for encontrada', async () => {
    const idInexistente = 'a0000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/tarefas/${idInexistente}`);

    assert.equal(response.status, 404);
    assert.ok(response.body.erro);
  });

  test('PUT /tarefas/:objectId - deve atualizar a descricao e o status de uma tarefa', async () => {
    const criacao = await request(app)
      .post('/tarefas')
      .send({ descricao: 'Tarefa para atualizar' });

    const objectId = criacao.body.objectId;

    const response = await request(app)
      .put(`/tarefas/${objectId}`)
      .send({
        descricao: 'Tarefa atualizada',
        concluida: true
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.descricao, 'Tarefa atualizada');
    assert.equal(response.body.concluida, true);
  });

  test('PUT /tarefas/:objectId - deve retornar 404 se a tarefa a ser atualizada não existir', async () => {
    const idInexistente = 'b0000000-0000-0000-0000-000000000000';
    const response = await request(app)
      .put(`/tarefas/${idInexistente}`)
      .send({
        descricao: 'Teste'
      });

    assert.equal(response.status, 404);
  });

  test('DELETE /tarefas/:objectId - deve remover a tarefa com sucesso', async () => {
    const criacao = await request(app)
      .post('/tarefas')
      .send({ descricao: 'Tarefa a ser deletada' });

    const objectId = criacao.body.objectId;

    const deleteResponse = await request(app).delete(`/tarefas/${objectId}`);
    assert.equal(deleteResponse.status, 200);
    assert.ok(deleteResponse.body.mensagem);

    const buscaResponse = await request(app).get(`/tarefas/${objectId}`);
    assert.equal(buscaResponse.status, 404);
  });

  test('DELETE /tarefas/:objectId - deve retornar 404 ao tentar remover tarefa inexistente', async () => {
    const idInexistente = 'c0000000-0000-0000-0000-000000000000';
    const response = await request(app).delete(`/tarefas/${idInexistente}`);

    assert.equal(response.status, 404);
  });
});
