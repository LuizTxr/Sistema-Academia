# Sistema-Academia

NoTreino - Sistema de gestao de treinos com foco em experiencia mobile first para alunos de academia.

## Visao Geral

O projeto esta organizado para separar frontend, backend e futuras extensoes mobile.

Hoje, o frontend web ja possui um MVP navegavel do fluxo principal do aluno integrado ao backend NestJS:

- login por matricula
- sessao local no dispositivo vinculada a matricula
- selecao automatica do treino pelo dia atual
- visualizacao dos treinos por dia da semana por aluno
- expansao de exercicios
- conclusao sequencial de series
- conclusao de exercicio
- rascunho local persistido no navegador por aluno
- salvamento local de progresso por aluno

## Estrutura do Projeto

```text
Sistema-Academia/
  backend/
    api/
  web/
  mobile/
  database/
  infra/
  docs/
```

### Pastas principais

- `backend/api`: backend em NestJS
- `web`: frontend web em React + Vite + TypeScript
- `mobile`: reservado para futura experiencia mobile dedicada
- `database`: artefatos relacionados a banco
- `infra`: configuracoes de infraestrutura
- `docs`: documentacao de apoio

## Frontend

O frontend fica em [`web`](C:\Academia-Sistema\web) e segue estas diretrizes:

- React com Vite
- TypeScript
- Tailwind CSS
- mobile first
- organizacao por features
- tokens visuais centralizados

### Estado atual do frontend

O fluxo demonstravel atual e:

1. aluno acessa a tela de login
2. entra com a matricula
3. cai direto na tela de treino
4. visualiza o treino correspondente ao dia atual
5. navega entre os dias ativos
6. expande exercicios
7. conclui series em sequencia
8. conclui exercicios
9. salva o progresso localmente

### Endpoints usados pelo frontend

- `POST /auth/aluno/login`
- `GET /alunos/:matricula/treinos`

### Rodando o frontend

```powershell
cd web
npm install
npm run dev
```

### Build do frontend

```powershell
cd web
npm run build
```

## Backend

O backend atual fica em [`backend/api`](C:\Academia-Sistema\backend\api).

Para instalar as dependencias do backend:

```powershell
cd backend/api
npm install
```

### Autenticacao transitoria do backend

Os endpoints protegidos usam, por enquanto, estes headers:

- `x-user-role`
- `x-user-id`

Documentacao operacional:

- [API_BACKEND.md](C:\Academia-Sistema\docs\API_BACKEND.md)
- Swagger local: `http://localhost:3000/api`
- Postman: [backend-api.collection.json](C:\Academia-Sistema\postman\collections\backend-api.collection.json)

### Modulos backend estabilizados

Os contratos abaixo ja estao consolidados para consumo dos demais colaboradores:

- `alunos`
- `professores`
- `treinos`
- `treino-exercicios`
- `equipamentos`
- `exercicios`
- `aluno-portal` como fachada transitória do frontend do aluno

## Observacoes

- o fluxo do aluno ja consome a API NestJS para identificacao por matricula e carga dos treinos
- a autenticacao forte com Keycloak continua como proximo passo do plano
- o progresso do treino continua local ao navegador e separado por matricula
