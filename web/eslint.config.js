import { readdirSync } from 'node:fs'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const manual = 'Veja web/ARQUITETURA.md.'

const features = readdirSync(new URL('./src/features/', import.meta.url), {
  withFileTypes: true,
})
  .filter((entrada) => entrada.isDirectory())
  .map((entrada) => entrada.name)

const importarDeApp = {
  group: ['@/app', '@/app/**'],
  message: `Ninguem fora de app/ pode importar de app/. Se precisar compartilhar (ex.: rotas), mova para shared/. ${manual}`,
}

const importarDeFeatures = {
  group: ['@/features', '@/features/**'],
  message: `shared/ nao pode importar de features/. ${manual}`,
}

const importarDeOutraFeature = (outra) => ({
  group: [`@/features/${outra}`, `@/features/${outra}/**`],
  message: `Uma feature nao pode importar de outra feature (${outra}). Se os dois precisam, mova para shared/. ${manual}`,
})

const importarComVoltas = (niveis) => ({
  group: [`${'../'.repeat(niveis)}**`],
  message: `Para importar de outra pasta use o alias @/ (ex.: @/shared/lib/cliente-api). ${manual}`,
})

// Cada area lista o que ela NAO pode importar. "raizes" sao as pastas onde
// um unico "../" ja sai da area (ou do grupo de pastas irmas).
const areas = [
  { pasta: 'src/app', raizes: ['src/app/*'], proibidos: [] },
  {
    pasta: 'src/shared',
    raizes: ['src/shared/*'],
    proibidos: [importarDeApp, importarDeFeatures],
  },
  ...features.map((feature) => ({
    pasta: `src/features/${feature}`,
    raizes: [`src/features/${feature}`],
    proibidos: [
      importarDeApp,
      ...features
        .filter((outra) => outra !== feature)
        .map(importarDeOutraFeature),
    ],
  })),
]

const pacotesReact = ['react', 'react-dom', 'react-router'].map((name) => ({
  name,
  message: `O service nao conhece React (page -> hook -> service -> dto). ${manual}`,
}))

// Cada camada lista o que ela NAO pode importar (page -> hook -> service -> dto).
const camadas = [
  { arquivos: '*.{ts,tsx}', proibidos: [], pacotes: [] },
  {
    arquivos: '*.page.tsx',
    proibidos: [
      {
        group: ['**/*.service'],
        message: `A pagina nao chama o service; use o hook da feature (page -> hook -> service). ${manual}`,
      },
    ],
    pacotes: [],
  },
  {
    arquivos: '*.hook.ts',
    proibidos: [
      {
        group: ['**/*.page'],
        message: `O hook nao importa a pagina (page -> hook). ${manual}`,
      },
    ],
    pacotes: [],
  },
  {
    arquivos: '*.service.ts',
    proibidos: [
      {
        group: ['**/*.hook', '**/*.page'],
        message: `O service nao importa hook nem pagina (page -> hook -> service). ${manual}`,
      },
    ],
    pacotes: pacotesReact,
  },
  {
    arquivos: '*.dto.ts',
    proibidos: [
      {
        group: ['./*', '../*', '@/features/**'],
        message: `O DTO nao importa nada da feature. ${manual}`,
      },
    ],
    pacotes: [],
  },
]

// A ultima regra que casa com o arquivo vale; por isso cada bloco repete
// os proibidos da area junto com os da camada. Os blocos das raizes vem
// depois dos aninhados para que a regra de "../" mais estrita prevaleca.
function bloco(arquivosGlob, niveis, area, camada) {
  return {
    files: [arquivosGlob],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: camada.pacotes,
          patterns: [
            importarComVoltas(niveis),
            ...area.proibidos,
            ...camada.proibidos,
          ],
        },
      ],
    },
  }
}

const regrasDeImportacao = areas.flatMap((area) => [
  ...camadas.map((camada) =>
    bloco(`${area.pasta}/**/${camada.arquivos}`, 2, area, camada),
  ),
  ...area.raizes.flatMap((raiz) =>
    camadas.map((camada) =>
      bloco(`${raiz}/${camada.arquivos}`, 1, area, camada),
    ),
  ),
])

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Compound components exportam um objeto (ex.: Exercicio = { Root, ... }),
    // o que a regra de fast refresh nao aceita.
    files: ['src/**/components/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  ...regrasDeImportacao,
])
