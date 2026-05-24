# Sistema Academia

Sistema de gestão de treinos com foco mobile. O aluno faz login pela matrícula e acompanha sua semana de treinos com exercícios, séries e progresso salvo no banco de dados.

## Requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/LuizTxr/Sistema-Academia.git
cd Sistema-Academia
```

### 2. Configure as variáveis de ambiente

**Backend:**
```bash
cp backend/api/.env.example backend/api/.env
```

**Frontend:**
```bash
cp web/.env.example web/.env
```

### 3. Suba o backend

```bash
cd backend/api
npm install
npm run dev
```

Esse comando sobe o banco de dados via Docker, roda as migrations, popula os dados iniciais e inicia a API.

- API disponível em `http://localhost:3000`
- Documentação Swagger em `http://localhost:3000/api`

### 4. Suba o frontend

Em outro terminal:

```bash
cd web
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.

## Acessos de teste

| Matrícula | Nome            |
|-----------|-----------------|
| 1001      | Lucas Andrade   |
| 1002      | Marina Costa    |
| 1003      | Rafael Souza    |
| 1004      | Juliana Lima    |
| 1005      | Bruno Mendes    |
| 1006      | Camila Ferreira |
| 1007      | Diego Oliveira  |
| 1008      | Fernanda Rocha  |
| 1009      | Gustavo Nunes   |
| 1010      | Helena Martins  |

## Estrutura do projeto

```
Sistema-Academia/
├── backend/api/    # NestJS + Prisma + PostgreSQL
├── web/            # React + Vite + Tailwind CSS
├── docs/           # Documentação e contratos de API
└── docker-compose.yml
```

## Resetar o banco

Para limpar tudo e popular do zero:

```bash
cd backend/api
docker compose down -v
npm run dev
```
