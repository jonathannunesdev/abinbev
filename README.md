# Sistema de Gerenciamento de Usuários

Sistema completo com API REST (backend) e interface web (frontend) para gerenciar usuários com autenticação JWT.

## Estrutura do Projeto

```
abi/
├── backend/     # API REST (Node.js + NestJS)
└── frontend/    # Interface Web (Next.js + React)
```

## Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- Redis
- Yarn

## Como executar

### 1. Instalar dependências

```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

### 2. Configurar Backend

```bash
cd backend

# Configurar variáveis de ambiente
cp env.example .env
# Edite o .env com suas configurações de banco

# Gerar JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copie o resultado e substitua no .env na linha JWT_SECRET

# Inicializar banco de dados
./scripts/database/setup.sh

# Iniciar Redis
redis-server
```

### 3. Executar o sistema

#### Backend (API)
```bash
cd backend
yarn start:dev
```
A API estará disponível em `http://localhost:3333`

#### Frontend (Interface Web)
```bash
cd frontend
yarn dev
```
A interface web estará disponível em `http://localhost:3000`

## Funcionalidades

### Backend
- **Usuários**: CRUD completo de usuários
- **Autenticação**: Login com JWT
- **Segurança**: Middleware de autenticação
- **Cache**: Redis para otimização
- **Documentação**: Swagger disponível

### Frontend
- **Login**: Interface de autenticação
- **Painel**: Gerenciamento de usuários
- **CRUD**: Criar, listar, editar e deletar usuários
- **Responsivo**: Interface otimizada para diferentes dispositivos

## Endpoints da API

### Usuários
- `POST /users` - Criar usuário (público)
- `GET /users` - Listar usuários (autenticado)
- `GET /users/:id` - Buscar usuário (autenticado)
- `PUT /users/:id` - Atualizar usuário (autenticado)
- `DELETE /users/:id` - Deletar usuário (autenticado)

### Autenticação
- `POST /auth/login` - Login (público)

## Testes

```bash
# Backend
cd backend
yarn test

# Frontend
cd frontend
yarn test
```

## Tecnologias Utilizadas

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Redis
- JWT
- Swagger

### Frontend
- Next.js
- React
- TypeScript
- Material-UI
- React Query
- Axios 