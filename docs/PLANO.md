# /plan - Sistema de Academia

## Objetivo

Entregar um sistema multiplataforma para academia em que:

- instrutores criam, editam e consultam planos de treinamento;
- alunos consultam apenas os próprios planos;
- o sistema impede acesso indevido a planos de terceiros;
- instrutores só alteram planos de sua autoria;
- a solução use software livre e arquitetura em camadas.

Esse plano foi definido a partir do documento `Projeto_Academia_ABNT_Refinado_Original.docx` e do estado atual do repositório em `2026-03-18`.

## Diagnóstico Atual

### Já existe

- backend NestJS com Prisma e PostgreSQL;
- modelos de `Aluno`, `Professor`, `Treino`, `Exercicio`, `Equipamento` e `TreinoExercicio`;
- CRUD parcial para `alunos`, `equipamentos` e `exercicios`;
- `docker-compose.yml` para PostgreSQL;
- estrutura inicial para `web`, `mobile`, `docs`, `infra` e coleções Postman.

### Lacunas críticas

- `AppModule` não importa `AlunosModule`;
- não há módulos para `professores`, `treinos`, `auth` e autorização;
- não existe integração com Keycloak, apesar de constar no documento;
- `web` e `mobile` ainda estão praticamente vazios;
- faltam regras de negócio documentadas, casos de uso e protótipos reais;
- não há proteção para garantir:
  - aluno ver apenas o próprio treino;
  - professor editar apenas treinos de sua autoria.

## Escopo Funcional

### Perfis

- Professor/Instrutor
- Aluno
- Administrador técnico

### Funcionalidades essenciais

- autenticação centralizada;
- cadastro e consulta de alunos;
- cadastro e consulta de professores;
- cadastro de equipamentos;
- cadastro de exercícios;
- criação de treinos por professor;
- associação de exercícios ao treino com ordem, séries, repetições, carga, descanso e observações;
- consulta de treinos pelo professor autor;
- consulta de treinos pelo aluno dono;
- trilha mínima de auditoria para autoria e atualização.

## /plan por Fases

### Fase 1 - Consolidação do domínio e do backend

Objetivo: deixar a API coerente com o modelo de negócio do documento.

Entregas:

- corrigir composição do `AppModule`;
- revisar `schema.prisma` para incluir campos operacionais ausentes:
  - status do treino;
  - datas de criação e atualização;
  - identificador externo do usuário autenticado;
- criar módulos NestJS para:
  - `professores`;
  - `treinos`;
  - `treino-exercicios`;
- padronizar DTOs, validações e erros;
- expor endpoints REST com Swagger;
- criar seeds mínimos para ambiente local.

Critério de aceite:

- API sobe localmente;
- migrations aplicam sem erro;
- CRUDs essenciais de domínio funcionam;
- documentação Swagger cobre os endpoints principais.

### Fase 2 - Autenticação e autorização

Objetivo: implementar a regra central do trabalho acadêmico.

Entregas:

- integrar Keycloak ao backend;
- definir papéis `professor` e `aluno`;
- mapear token para identidade local;
- criar guards/interceptors para autorização;
- aplicar regras:
  - professor só cria/edita treinos dos quais é autor;
  - aluno só consulta treinos vinculados ao próprio cadastro;
  - recursos administrativos ficam restritos.

Critério de aceite:

- login com token válido;
- acesso negado para consulta indevida;
- acesso negado para edição por professor não autor;
- testes automatizados cobrindo cenários de permissão.

### Fase 3 - Web para instrutores

Objetivo: entregar a interface web de gestão de treinos.

Entregas:

- iniciar aplicação `web` com React/Next.js;
- fluxo de login;
- dashboard do professor;
- telas de:
  - alunos;
  - exercícios;
  - equipamentos;
  - criação/edição de treinos;
- listagem de treinos por aluno;
- visualização do treino com ordem dos exercícios.

Critério de aceite:

- professor autenticado consegue montar um treino completo via interface;
- interface consome a API com tratamento de erro e estado de carregamento;
- rotas protegidas por perfil.

### Fase 4 - Mobile para alunos

Objetivo: entregar o app de consulta de treino.

Entregas:

- iniciar aplicação React Native;
- login do aluno;
- tela de treinos disponíveis;
- detalhe do treino com exercícios, séries, repetições, carga e descanso;
- comportamento offline mínimo com cache de última consulta, se viável;
- tratamento de sessão expirada.

Critério de aceite:

- aluno autenticado enxerga apenas os próprios treinos;
- consulta funciona em dispositivo real ou emulador;
- navegação principal validada ponta a ponta.

### Fase 5 - Qualidade, documentação e entrega acadêmica

Objetivo: fechar o projeto com rastreabilidade.

Entregas:

- testes unitários para serviços críticos;
- testes e2e para autenticação e treinos;
- coleção Postman atualizada;
- documentação em `docs`:
  - requisitos funcionais;
  - regras de negócio;
  - casos de uso;
  - protótipos;
  - arquitetura;
- revisão do `README.md` com setup completo;
- definição de pipeline de lint, test e build.

Critério de aceite:

- projeto sobe com instruções reproduzíveis;
- testes principais passam;
- documentação cobre o que foi implementado;
- arquitetura final permanece aderente ao documento-base.

## Backlog Priorizado

### Prioridade alta

- importar `AlunosModule` no `AppModule`;
- criar módulo de `Treinos`;
- criar módulo de `Professores`;
- integrar autenticação;
- proteger endpoints por perfil e autoria;
- implementar web do professor.

### Prioridade média

- app mobile do aluno;
- auditoria básica;
- documentação formal dos requisitos;
- seeds e massa de teste.

### Prioridade baixa

- cache offline no mobile;
- métricas e observabilidade;
- relatórios administrativos.

## Regras de Negócio que devem orientar a implementação

- um aluno não pode visualizar treinos de outro aluno;
- um professor não pode editar treino criado por outro professor;
- todo treino deve estar vinculado a um professor e a um aluno;
- todo item de treino deve referenciar um exercício válido;
- exercícios podem depender de equipamento;
- autenticação deve ser centralizada e separada da regra de negócio da API.

## Sequência recomendada de execução

1. Fechar modelagem e módulos de backend.
2. Subir autenticação e autorização.
3. Entregar fluxo web do professor.
4. Entregar fluxo mobile do aluno.
5. Fechar testes, documentação e preparação da entrega.

## Riscos

- implementar frontend antes da autorização tende a gerar retrabalho;
- ausência de vínculo entre usuário autenticado e entidades locais pode quebrar as regras de acesso;
- evoluir Prisma sem migrations consistentes pode causar divergência entre ambientes;
- deixar a documentação para o final tende a desalinhar o projeto do documento acadêmico.

## Próxima Sprint Recomendada

- corrigir `AppModule`;
- criar CRUD de `Professores`;
- criar CRUD de `Treinos` com `TreinoExercicio`;
- adicionar campos de auditoria no Prisma;
- definir estratégia de integração com Keycloak;
- escrever testes e2e dos cenários:
  - professor cria treino;
  - professor edita treino próprio;
  - professor não edita treino alheio;
  - aluno consulta apenas o próprio treino.
