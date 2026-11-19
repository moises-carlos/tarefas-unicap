const express = require('express');
require('dotenv').config({ path: ['.env.local', '.env'] });
const sequelize = require('./config/database');
const tarefaRoutes = require('./routes/tarefa');

const app = express();

app.use(express.json());

let dbSynced = false;
app.use(async (req, res, next) => {
  if (!dbSynced && process.env.NODE_ENV !== 'test') {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      dbSynced = true;
    } catch (err) {
      console.error('Erro na sincronização do banco:', err.message);
    }
  }
  next();
});

app.use('/tarefas', tarefaRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API RESTful de Tarefas online',
    versao: '1.0.0',
    endpoints: {
      criar: 'POST /tarefas',
      listar: 'GET /tarefas',
      buscarPorId: 'GET /tarefas/:objectId',
      atualizar: 'PUT /tarefas/:objectId',
      remover: 'DELETE /tarefas/:objectId'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => {
      console.log('Banco de dados conectado e sincronizado.');
      app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Falha ao inicializar o banco de dados:', err.message);
    });
}

module.exports = app;
