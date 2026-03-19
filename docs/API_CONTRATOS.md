# Contratos Esperados da API

Este documento descreve os contratos esperados da API para suportar o frontend atual do MVP do aluno.

O objetivo aqui nao e refletir exatamente o backend ja implementado hoje, mas registrar o contrato que o frontend precisara consumir na integracao real.

## Objetivo do MVP

O frontend atual espera suportar este fluxo:

1. login do aluno por matricula
2. carregamento dos dados basicos do aluno
3. carregamento dos treinos por dia da semana
4. envio manual do progresso do treino

## Convencoes

- Base sugerida: `/api`
- Formato de resposta: `application/json`
- Datas em ISO 8601 quando aplicavel
- Todos os ids em string

## 1. Login do aluno por matricula

### Endpoint

`POST /api/auth/aluno/login`

### Request

```json
{
  "matricula": "1001"
}
```

### Response 200

```json
{
  "aluno": {
    "id": "aluno_1",
    "matricula": "1001",
    "nome": "Lucas Andrade",
    "objetivo": "Hipertrofia"
  },
  "sessao": {
    "token": "jwt-ou-token-simples",
    "expiraEm": "2026-03-31T23:59:59.000Z"
  }
}
```

### Response 404

```json
{
  "message": "Matricula nao encontrada"
}
```

## 2. Perfil resumido do aluno autenticado

### Endpoint

`GET /api/aluno/me`

### Headers

```http
Authorization: Bearer <token>
```

### Response 200

```json
{
  "id": "aluno_1",
  "matricula": "1001",
  "nome": "Lucas Andrade",
  "objetivo": "Hipertrofia"
}
```

## 3. Treinos do aluno por semana

### Endpoint

`GET /api/aluno/me/treinos`

### Headers

```http
Authorization: Bearer <token>
```

### Response 200

```json
{
  "dias": [
    {
      "id": "seg",
      "label": "Seg",
      "ativo": true,
      "titulo": "Treino A",
      "exercicios": [
        {
          "id": "supino-reto",
          "nome": "Supino reto",
          "observacoes": "Movimento controlado e descanso de 60 segundos.",
          "series": [
            {
              "id": "supino-1",
              "label": "Serie 1",
              "repeticoes": "12 reps"
            },
            {
              "id": "supino-2",
              "label": "Serie 2",
              "repeticoes": "10 reps"
            }
          ]
        }
      ]
    },
    {
      "id": "ter",
      "label": "Ter",
      "ativo": true,
      "titulo": "Treino B",
      "exercicios": []
    },
    {
      "id": "qui",
      "label": "Qui",
      "ativo": false,
      "titulo": "Sem treino",
      "exercicios": []
    }
  ]
}
```

## 4. Progresso do treino do aluno

Esse endpoint representa o envio manual do botao `Salvar progresso`.

### Endpoint

`PUT /api/aluno/me/treinos/:diaId/progresso`

Exemplo:

`PUT /api/aluno/me/treinos/seg/progresso`

### Headers

```http
Authorization: Bearer <token>
```

### Request

```json
{
  "seriesConcluidas": ["supino-1", "supino-2"],
  "exerciciosConcluidos": ["supino-reto"]
}
```

### Response 200

```json
{
  "diaId": "seg",
  "seriesConcluidas": ["supino-1", "supino-2"],
  "exerciciosConcluidos": ["supino-reto"],
  "treinoConcluido": false,
  "salvoEm": "2026-03-18T21:30:00.000Z"
}
```

## 5. Progresso salvo previamente

Se o backend passar a ser a fonte principal de verdade do progresso, o frontend pode restaurar o ultimo estado salvo por dia com o proprio carregamento do treino, sem endpoint separado.

### Estrutura esperada no `GET /api/aluno/me/treinos`

```json
{
  "dias": [
    {
      "id": "seg",
      "label": "Seg",
      "ativo": true,
      "titulo": "Treino A",
      "progresso": {
        "seriesConcluidas": ["supino-1"],
        "exerciciosConcluidos": [],
        "treinoConcluido": false,
        "salvoEm": "2026-03-18T21:30:00.000Z"
      },
      "exercicios": []
    }
  ]
}
```

## Tipos esperados pelo frontend

### Aluno

```json
{
  "id": "string",
  "matricula": "string",
  "nome": "string",
  "objetivo": "string"
}
```

### Dia de treino

```json
{
  "id": "seg|ter|qua|qui|sex|sab|dom",
  "label": "string",
  "ativo": true,
  "titulo": "string",
  "exercicios": []
}
```

### Exercicio

```json
{
  "id": "string",
  "nome": "string",
  "observacoes": "string",
  "series": []
}
```

### Serie

```json
{
  "id": "string",
  "label": "string",
  "repeticoes": "string"
}
```

## Regras de comportamento esperadas

- o login aceita apenas matricula no MVP
- o frontend espera nome e objetivo do aluno logo apos autenticacao
- o backend deve devolver os 7 dias da semana, com dias sem treino marcados como inativos
- o treino do dia atual deve ser identificavel pelo frontend a partir do id do dia
- o frontend controla rascunho local no dispositivo
- o envio ao backend acontece apenas quando o usuario tocar em `Salvar progresso`

## Fora do escopo atual

Ainda nao fazem parte obrigatoria deste contrato:

- area do professor
- historico de treinos passados
- autenticacao com senha
- login por URL com matricula embutida
- sincronizacao automatica offline
- notificacoes
