# Padrao Arquitetural do Frontend

Este documento define como o codigo do `web/` e organizado: idioma, pastas, arquivos de cada pagina e a forma de escrever os componentes de interface.

Este e o manual de regras da arquitetura do frontend e a referencia para toda pagina nova.

## 1. Idioma do codigo

Os nomes do codigo (pastas, arquivos, componentes, funcoes, variaveis, tipos e props) sao escritos em **portugues**.

**Por que:** a escrita em portugues foi adotada para que os outros alunos, que ainda nao conhecem programacao, consigam entender o projeto mais facilmente ao ler o codigo. Um nome como `Exercicio.Cabecalho` e compreendido por quem esta comecando; `Exercise.Header` exige saber ingles tecnico.

**O que fica em ingles:** alguns jargoes tecnicos foram mantidos como padrao porque sao linguagem universal da area. Quem aprende isso aqui vai encontrar exatamente os mesmos termos em qualquer projeto, documentacao ou vaga.

| Fica em ingles (jargao universal) | Vai para portugues (negocio da academia) |
|---|---|
| `page`, `hook`, `service`, `dto`, `provider` | `treino`, `aluno`, `exercicio`, `serie`, `matricula`, `professor`, `equipamento` |
| `Root` (raiz de um compound component) | Nomes de componentes, funcoes e variaveis: `Exercicio`, `marcarSerie`, `treinoDoDia` |
| `login`, `auth`, `props`, `lazy`, `children`, `className` | Props e eventos que criamos: `expandido`, `aoAlternar` |
| Nomes impostos por biblioteca ou linguagem: `use...` dos hooks (`useTreino`), `React`, `Tailwind`, `type` | |

### Regras

- Regra de bolso: se o termo aparece igual em qualquer projeto de programacao, mantem em ingles. Se e do negocio da academia, portugues.
- Sem acentos e sem cedilha em nomes de codigo e de arquivo (`serie`, `acoes`, `cabecalho`).
- O prefixo `use` dos hooks e obrigatorio do React e permanece: `useTreinoDoDia`, `useLogin`.
- Os termos do dominio seguem o backend e o banco (`aluno`, `treino`, `exercicio`, `matricula`).
- **Nomes que vem da API:** o DTO de resposta guarda os campos exatamente como o backend devolve (mesmo em ingles), e o servico converte para um modelo em portugues. A interface (hook, pagina e componentes) so enxerga o modelo em portugues. Exemplo: `SessaoAlunoResposta` (`enrollmentCode`) vira `SessaoAluno` (`matricula`).

## 2. Estrutura de pastas

```text
web/src/
  app/
    providers/              # composicao dos providers globais
    router/                 # AppRouter, router, paths, protected.route (guards)
  features/
    auth/
      auth.dto.ts
      auth.service.ts
      login.page.tsx
      login.hook.ts
    treino/
      treino.page.tsx
      treino.hook.ts
      treino.service.ts
      treino.dto.ts
      components/           # componentes exclusivos da feature
        exercicio.tsx
        abas-dias-semana.tsx
  shared/                   # usado por duas ou mais features
    components/             # UI generica (ex.: pagina-mobile.tsx)
    lib/                    # cliente-api.ts, armazenamento.ts (storage generico)
    sessao/                 # estado global da sessao do aluno (dto, service, hook, provider)
    styles/                 # theme.css, globals.css
  App.tsx
  main.tsx
```

### Regras de pasta

- A feature e **plana**: os arquivos de camada ficam na raiz da feature, sem subpasta por tipo (`pages/`, `services/`, `types/` nao existem mais).
- A unica subpasta permitida dentro da feature e `components/`.
- `shared/` so recebe o que ja e usado por duas ou mais features. Nao mover codigo para la antes da segunda necessidade.
- Dependencias so em uma direcao: `app` -> `features` -> `shared`. `shared` nunca importa de uma feature, e uma feature nao importa de outra.
- Estado global usado por varias features (ex.: a sessao do aluno) mora em `shared/<nome>/`, com os mesmos papeis de arquivo (`.dto`, `.service`, `.hook`, `.provider`). Assim a feature `treino` le a sessao sem importar da feature `auth`.

### Imports

- Entre pastas diferentes, usar o alias `@/` (aponta para `src/`): `@/shared/lib/cliente-api`, `@/features/treino/treino.page`.
- Dentro da mesma pasta, usar caminho relativo: `./treino.dto`, `../treino.dto`.
- O alias esta configurado em `vite.config.ts` (`resolve.alias`) e em `tsconfig.app.json` (`paths`). Ao mudar um, mudar o outro.

## 3. Estrutura de arquivos de uma pagina

Cada pagina e dividida em quatro camadas, cada uma em um arquivo com o formato `<nome>.<papel>.<ext>`, em kebab-case.

| Arquivo | Camada | Responsabilidade |
|---|---|---|
| `treino.page.tsx` | Pagina | Interface. Compoe componentes e chama hooks. Sem regra de negocio e sem `fetch`. |
| `treino.hook.ts` | Hook | Estado, efeitos e regras da tela (selecao de dia, sequencia de series, rascunho). |
| `treino.service.ts` | Servico | Acesso a dados: chamadas de API e leitura/escrita de storage. Nao conhece React. |
| `treino.dto.ts` | DTO | Tipos dos dados que entram e saem do servico (contrato com a API). |

### Regra de dependencia

```text
page -> hook -> service -> dto
```

- A pagina nunca chama o servico diretamente.
- O servico nunca importa React nem hooks.
- O DTO nao importa nada da feature.
- Logica reaproveitavel entre paginas da mesma feature fica no hook ou no servico, nunca copiada na pagina.

### Detalhes

- **Um hook por tela:** a pagina chama um unico hook (`useTreino`) que devolve tudo que a tela precisa, ja pronto para exibir. Se o arquivo crescer demais, dividir em hooks menores que o hook principal compoe.
- **Regras puras** (ex.: "so pode marcar a proxima serie") ficam como funcoes puras exportadas no proprio `.hook.ts`, para poderem ser testadas sem React.
- **Uma feature, varias paginas:** cada pagina tem seu par `<pagina>.page.tsx` e `<pagina>.hook.ts`. Servico e DTO sao compartilhados pela feature (`auth.service.ts` atende `login.page.tsx`).
- **Provider e contexto:** quando ha estado global (ex.: sessao), o contexto e o hook de acesso ficam em `<nome>.hook.ts` e o componente em `<nome>.provider.tsx`. Se mais de uma feature usa esse estado, tudo isso mora em `shared/<nome>/`.
- **Componentes** dentro de `components/` usam kebab-case e **nao** levam sufixo de papel (`exercicio.tsx`, `abas-dias-semana.tsx`).

## 4. Componentes de interface: Compound Components

Ao escrever o HTML/JSX das paginas, o padrao e **Compound Components**.

### O que e

Compound Components e um padrao em que um componente pai expoe subcomponentes que trabalham juntos e compartilham estado de forma implicita, via Context. Quem usa monta a estrutura livremente, sem passar uma lista longa de props.

Analogia: `<select>` e `<option>`. O `<select>` sozinho nao faz nada, e o `<option>` fora dele nao faz sentido, mas juntos formam uma unidade. Quem escreve decide quais opcoes existem e em que ordem; o `<select>` cuida do estado.

### Sem o padrao (props em cascata)

```tsx
<CartaoExercicio
  exercicio={exercicio}
  expandido={expandido}
  concluido={concluido}
  seriesConcluidas={seriesConcluidas}
  mostrarNotas
  aoAlternar={aoAlternar}
  aoMarcarSerie={aoMarcarSerie}
  aoConcluirExercicio={aoConcluirExercicio}
/>
```

Cada variacao de layout vira uma prop nova (`mostrarNotas`, `compacto`, `esconderAcoes`...), e o componente cresce sem fim.

### Com o padrao

```tsx
<Exercicio.Root
  exercicio={exercicio}
  expandido={expandido}
  concluido={concluido}
  seriesConcluidas={seriesConcluidas}
  aoAlternar={aoAlternar}
>
  <Exercicio.Cabecalho />
  <Exercicio.Corpo>
    <Exercicio.Notas />
    <Exercicio.Series aoAlternarSerie={aoAlternarSerie} />
    <Exercicio.Acoes aoConcluir={aoConcluir} />
  </Exercicio.Corpo>
</Exercicio.Root>
```

Quem usa escolhe quais partes aparecem e em que ordem. Para esconder as notas, basta nao renderizar `<Exercicio.Notas />`. Exemplo real: `features/treino/components/exercicio.tsx`.

### Como implementar

Os nomes dos slots e das props deste exemplo seguem as sugestoes da secao "Padroes internos", que ainda estao em avaliacao.

```tsx
// components/exercicio.tsx
import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import type { ExercicioTreino } from '../treino.dto'

type ExercicioContextoValor = {
  exercicio: ExercicioTreino
  expandido: boolean
  aoAlternar: () => void
}

const ExercicioContexto = createContext<ExercicioContextoValor | null>(null)

function useExercicio() {
  const contexto = useContext(ExercicioContexto)

  if (!contexto) {
    throw new Error('Exercicio.* deve ser usado dentro de <Exercicio.Root>.')
  }

  return contexto
}

function ExercicioRoot({
  children,
  ...valor
}: PropsWithChildren<ExercicioContextoValor>) {
  return (
    <ExercicioContexto.Provider value={valor}>
      <article>{children}</article>
    </ExercicioContexto.Provider>
  )
}

function ExercicioCabecalho() {
  const { exercicio, expandido, aoAlternar } = useExercicio()

  return (
    <button type="button" onClick={aoAlternar} aria-expanded={expandido}>
      {exercicio.nome}
    </button>
  )
}

function ExercicioNotas() {
  const { exercicio, expandido } = useExercicio()

  return expandido && exercicio.notas ? <p>{exercicio.notas}</p> : null
}

export const Exercicio = {
  Root: ExercicioRoot,
  Cabecalho: ExercicioCabecalho,
  Notas: ExercicioNotas,
}
```

Os tres ingredientes:

1. **Context** guarda o estado compartilhado do grupo. E opcional: so entra quando os slots precisam compartilhar estado (como o `Exercicio`, que divide `expandido` entre cabecalho e notas). Sem estado compartilhado, a `Root` e apenas um involucro de layout (ver o exemplo `Notificacao` abaixo).
2. **Root** renderiza o wrapper (e o Context, quando existe). E sempre exposto como `<Nome.Root>`.
3. **Subcomponentes** sao expostos no mesmo objeto (`Exercicio.Cabecalho`, `Exercicio.Notas`...) e, quando ha Context, leem dele.

O grupo e exportado como um objeto simples (`Exercicio = { Root, Cabecalho, ... }`), e a raiz nunca e usada sozinha como `<Exercicio>`.

### Regras de uso no projeto

- Usar quando o componente tem **tres ou mais partes** independentes ou variacoes de layout (cartao de exercicio, abas de dias, `PaginaMobile` com cabecalho/corpo/rodape).
- **Nao usar** em componentes simples, sem partes internas (um botao, um campo, a tela de login como um todo).
- O `useExercicio` (hook interno) **nao e exportado**: so os subcomponentes do proprio grupo o usam.
- Um subcomponente usado fora da raiz deve falhar com erro claro (como acima), nunca renderizar vazio em silencio.
- Componentes do grupo ficam no mesmo arquivo enquanto forem pequenos. Se passar de ~150 linhas, virar uma pasta (`components/exercicio/`) com um arquivo por parte e um `index.ts`.
- Estilo continua com Tailwind e tokens de `theme.css` (`bg-[var(--color-surface)]`), sem valores soltos.
- Arquivos de compound components ficam em `components/` e exportam um objeto (`Exercicio = { Root, ... }`); por isso a regra `react-refresh/only-export-components` esta desligada para `src/**/components/**/*.tsx` em `eslint.config.js`. O unico efeito e o hot reload desses arquivos recarregar a pagina em vez de preservar estado.
- A **logica** (o que acontece ao marcar uma serie) continua no `.hook.ts` da pagina. O componente recebe callbacks e so cuida da apresentacao.

### Padroes internos (em construcao)

Os detalhes internos dos compound components **nao** sao definidos de uma vez. Cada padrao novo e registrado aqui quando aparecer em um componente real, com a decisao e o motivo.

**Definidos:**

- A raiz de todo grupo se chama `Root` e e usada como `<Nome.Root>`.

**Referencia de estilo (exemplo do usuario, traduzido):**

```tsx
<Notificacao.Root>
  <Notificacao.Icone icone={Foguete} />
  <Notificacao.Conteudo texto="Voce recebeu um convite para fazer parte da empresa Rocketseat." />
  <Notificacao.Acoes>
    <Notificacao.Acao onClick={() => {}} icone={X} />
    <Notificacao.Acao onClick={() => {}} icone={Check} className="" />
  </Notificacao.Acoes>
</Notificacao.Root>
```

O que esse exemplo mostra:

- Cada slot e pequeno e recebe dados por **props simples** (`texto`, `icone`), sem `children` quando o conteudo e curto.
- O icone e passado como **referencia do componente** (`icone={Foguete}`), nao como elemento pronto.
- Slots sao **opcionais**: uma notificacao sem `Icone` simplesmente omite o slot.
- Existe **grupo dentro de grupo**: `Acoes` (plural, o container) contem varias `Acao` (singular, o item).
- Este grupo nao precisa de Context: a `Root` so organiza o layout.
- `onClick` e `className` mantem o nome nativo do HTML/React.

> O projeto ainda nao tem biblioteca de icones. Escolher uma antes de usar `icone={...}`.

**Sugestoes em avaliacao (ainda nao adotadas):**

1. **Nomes dos slots.** Vocabulario fixo para os genericos: `Cabecalho`, `Corpo`, `Rodape`, `Titulo`, `Descricao`, `Icone`, `Conteudo`. Slots do negocio usam o termo do dominio: `Series`, `Notas`. Container no plural, item no singular: `Acoes` contem `Acao`, `Series` contem `Serie`.
2. **Dados por props simples.** Slot de conteudo curto recebe props (`texto`, `icone`); `children` so quando o conteudo for livre. Icone sempre como referencia de componente.
3. **Nomes das props.** Atributos nativos do HTML/React mantem o nome nativo (`onClick`, `className`, `disabled`), por serem jargao universal. Eventos proprios do negocio usam o prefixo `ao`: `aoAlternar`, `aoMarcarSerie`, `aoConcluir`. Booleanos como adjetivo: `expandido`, `concluido`.
4. **Context so quando necessario.** `Root` sem estado compartilhado e so um involucro. Quando os slots precisam dividir estado, usar Context com hook interno que falha fora da raiz.
5. **Raiz controlada.** Quando existe estado, a `Root` recebe o valor pronto (`expandido`, `aoAlternar`) do hook da pagina e nao guarda estado proprio. A regra fica no `.hook.ts`; o componente so apresenta. Estado interno so em efeito puramente visual (ex.: animacao).
6. **`className` nos slots.** Aceitar `className` para ajustes pontuais de estilo. Sem `asChild` por enquanto, para nao adicionar complexidade sem necessidade.
7. **Acessibilidade embutida.** Slots interativos ja saem com o atributo `aria-*` correto (ex.: `aria-expanded` no gatilho, `aria-label` em botao so com icone).
8. **Testes.** Testar o grupo montado do jeito que a pagina usa (raiz mais slots), e nao cada slot isolado.

Cada sugestao so vira "Definida" depois de aprovada e, de preferencia, depois de aparecer em um componente real.

## 5. Rotas

- Definidas em `app/router/`, nunca dentro das features. A feature so exporta a pagina.
- URLs ficam em `paths.ts`; nenhuma string de rota solta em `navigate()` ou `<Link>`.
- Prefixo por area: as rotas do aluno comecam com `/aluno` (`/aluno/login`, `/aluno/treino`). Uma area futura de professor usa `/professor`.
- Paginas carregadas com `lazy` no data router.
- Autenticacao por layout route (`ProtectedRoute` e `GuestRoute`): a pagina nao precisa saber de sessao.

## 6. Checklist para criar uma pagina nova

1. Criar a feature em `features/<nome>/` (ou reutilizar a existente), com o nome em portugues.
2. Escrever o DTO com o contrato da API: `<nome>.dto.ts`.
3. Escrever o servico com as chamadas: `<nome>.service.ts`.
4. Escrever o hook com estado e regras: `<pagina>.hook.ts`.
5. Escrever a pagina, so com JSX e chamadas de hook: `<pagina>.page.tsx`.
6. Montar a interface com Compound Components; criar em `components/` o que for novo.
7. Adicionar o path em `paths.ts` e a rota em `router.tsx`, com `lazy`.
8. Conferir o idioma (portugues, sem acentos nos nomes), a regra de dependencia (page -> hook -> service -> dto) e rodar `npm run lint` e `npm run build`.

## 7. Em aberto

- Adotar TanStack Query ou manter hooks manuais para busca de dados.
- Regra de ESLint (`no-restricted-imports`) para impor a direcao das dependencias.
- Estrategia de testes.
- Aprovar as sugestoes de padroes internos dos compound components (secao 4).