# API RESTful de Tarefas

API para gerenciamento de tarefas desenvolvida com Node.js, Express, Sequelize, PostgreSQL (NeonDB) e validações com Zod. Configurada para deploy serverless na Vercel.

## 📁 Estrutura do Projeto

```text
├── src/
│   ├── config/
│   │   └── database.js          # Conexão com Sequelize (PostgreSQL/NeonDB e fallback SQLite)
│   ├── controllers/
│   │   └── tarefaController.js  # Lógica de controle de requisição e resposta HTTP
│   ├── models/
│   │   └── tarefa.js            # Modelo da Tarefa no Sequelize com UUID objectId
│   ├── routes/
│   │   └── tarefa.js            # Mapeamento dos endpoints /tarefas
│   ├── services/
│   │   └── tarefaService.js     # Regras de negócio e operações de banco
│   ├── validators/
│   │   └── tarefaValidator.js   # Esquemas de validação com Zod
│   └── index.js                 # Inicialização do Express e exportação para Vercel
├── tests/
│   └── tarefa.test.js           # Testes de integração automatizados
├── .env.sample                  # Exemplo de variáveis de ambiente
├── vercel.json                  # Configuração para deploy serverless na Vercel
└── package.json                 # Dependências e scripts
```

## 🚀 Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env` baseado no `.env.sample`:
```bash
cp .env.sample .env
```
Preencha a variável `DATABASE_URL` com a string de conexão do seu banco NeonDB:
```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Rodar os testes automatizados
```bash
npm test
```

### 4. Rodar o servidor em modo de desenvolvimento
```bash
npm run dev
```

## 📋 Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/tarefas` | Cria uma nova tarefa (`descricao` obrigatória, `concluida` opcional) |
| `GET` | `/tarefas` | Lista todas as tarefas |
| `GET` | `/tarefas/:objectId` | Retorna uma tarefa por seu UUID |
| `PUT` | `/tarefas/:objectId` | Atualiza uma tarefa existente |
| `DELETE` | `/tarefas/:objectId` | Remove uma tarefa |

## ☁️ Publicação na Vercel

O projeto possui o arquivo `vercel.json` configurado para exportar a aplicação como Serverless Function:
1. Conecte o repositório na Vercel.
2. Adicione a variável de ambiente `DATABASE_URL` nas configurações do projeto na Vercel com os dados do NeonDB.
3. O deploy executará automaticamente.
