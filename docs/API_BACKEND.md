# API Backend

## Base local

- Swagger: `http://localhost:3000/api`
- API base: `http://localhost:3000`

## Autenticacao transitoria

Enquanto a autenticacao definitiva nao entra, os endpoints protegidos usam dois headers:

- `x-user-role`: `aluno` ou `professor`
- `x-user-id`: id numerico do usuario no banco

Exemplos com a massa atual:

- aluno Lucas: `x-user-role: aluno`, `x-user-id: 2`
- professor Joao: `x-user-role: professor`, `x-user-id: 1`

## Endpoints principais

### Aluno

- `POST /auth/aluno/login`
- `GET /alunos/:matricula/treinos`
- `POST /alunos`
- `GET /alunos`
- `GET /alunos/:id`
- `PUT /alunos/:id`
- `DELETE /alunos/:id`

Payload base de aluno:

```json
{
  "nome": "Lucas Andrade",
  "email": "lucas@academia.com",
  "matricula": "1001",
  "telefone": "11999999999"
}
```

### Professores

- `POST /professores`
- `GET /professores`
- `GET /professores/:id`
- `PUT /professores/:id`
- `DELETE /professores/:id`

### Treinos

- `POST /treinos`
- `GET /treinos`
- `GET /treinos/:id`
- `PUT /treinos/:id`
- `DELETE /treinos/:id`

Filtros aceitos em `GET /treinos`:

- `alunoId`
- `professorId`

### Treino Exercicios

- `POST /treino-exercicios`
- `PATCH /treino-exercicios/:id`
- `DELETE /treino-exercicios/:id`

Payload base de item de treino:

```json
{
  "treinoId": 1,
  "exercicioId": 1,
  "series": 3,
  "repeticoes": 12,
  "carga": 20,
  "descanso": 60,
  "ordem": 1
}
```

### Equipamentos

- `POST /equipamentos`
- `GET /equipamentos`
- `GET /equipamentos/:id`
- `PATCH /equipamentos/:id`
- `DELETE /equipamentos/:id`

Payload base de equipamento:

```json
{
  "nome": "Banco de supino",
  "tipo": "Livre"
}
```

### Exercicios

- `POST /exercicios`
- `GET /exercicios`
- `GET /exercicios/:id`
- `PATCH /exercicios/:id`
- `DELETE /exercicios/:id`

Payload base de exercicio:

```json
{
  "nome": "Supino reto",
  "grupoMuscular": "Peito",
  "equipamentoId": 1
}
```

## Regras atuais de acesso

- aluno so consulta os proprios treinos
- professor so consulta treinos vinculados a si
- professor so cria treino com o proprio `professorId`
- professor so altera e remove treino proprio
- professor so altera itens de treino de sua autoria

## Status de estabilidade

- `aluno-portal`: estavel para o frontend atual do aluno; manter contrato
- `treinos` e `treino-exercicios`: estaveis para consumo de backend/frontend
- `alunos`, `professores`, `equipamentos` e `exercicios`: CRUDs estabilizados para uso dos colaboradores
