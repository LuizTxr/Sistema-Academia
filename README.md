# Sistema-Academia

Sistema de gestao de treinos com foco em experiencia mobile first para alunos de academia.

## Visao Geral

O projeto esta organizado para separar frontend, backend e futuras extensoes mobile.

Hoje, o frontend web ja possui um MVP navegavel para demonstracao do fluxo principal do aluno:

- login por matricula
- sessao local no dispositivo
- selecao automatica do treino pelo dia atual
- visualizacao dos treinos por dia da semana
- expansao de exercicios
- conclusao sequencial de series
- conclusao de exercicio
- rascunho local persistido no navegador
- salvamento local de progresso

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

O frontend fica em [`web`](C:\GIT\Sistema-Academia\web) e segue estas diretrizes:

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

O backend atual fica em [`backend/api`](C:\GIT\Sistema-Academia\backend\api).

Para instalar as dependencias do backend:

```powershell
cd backend/api
npm install
```

## Observacoes

- o frontend atual ainda utiliza dados locais para demonstracao
- a integracao completa com a API NestJS ainda e um proximo passo
- o projeto ja esta em um ponto adequado para apresentar o fluxo principal do produto
