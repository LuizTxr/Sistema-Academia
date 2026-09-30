import { useState } from 'react'
import type { FormEvent } from 'react'
import { Botao } from '@/shared/components/botao'
import { Campo, CampoSelecao } from '@/shared/components/campo'
import type { ExercicioCatalogo } from '../gestao-treinos.dto'
import type { CamposItem, ErrosItem } from '../gestao-treinos.hook'

type FormularioItemProps = {
  catalogoAgrupado: { grupo: string; exercicios: ExercicioCatalogo[] }[]
  valoresIniciais: CamposItem
  erros: ErrosItem
  salvando: boolean
  aoSalvar: (campos: CamposItem) => void
  aoCancelar: () => void
}

export function FormularioItem({
  catalogoAgrupado,
  valoresIniciais,
  erros,
  salvando,
  aoSalvar,
  aoCancelar,
}: FormularioItemProps) {
  const [campos, setCampos] = useState(valoresIniciais)

  function alterar(campo: keyof CamposItem, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    aoSalvar(campos)
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      <CampoSelecao
        rotulo="Exercicio"
        name="exercicioId"
        disabled={salvando}
        value={campos.exercicioId}
        erro={erros.exercicioId}
        onChange={(evento) => alterar('exercicioId', evento.target.value)}
      >
        <option value="">Selecione...</option>
        {catalogoAgrupado.map(({ grupo, exercicios }) => (
          <optgroup key={grupo} label={grupo}>
            {exercicios.map((exercicio) => (
              <option key={exercicio.id} value={exercicio.id}>
                {exercicio.nome}
              </option>
            ))}
          </optgroup>
        ))}
      </CampoSelecao>

      <div className="grid grid-cols-2 gap-3">
        <Campo
          rotulo="Series"
          name="series"
          inputMode="numeric"
          disabled={salvando}
          value={campos.series}
          erro={erros.series}
          onChange={(evento) => alterar('series', evento.target.value)}
        />
        <Campo
          rotulo="Repeticoes"
          name="repeticoes"
          inputMode="numeric"
          disabled={salvando}
          value={campos.repeticoes}
          erro={erros.repeticoes}
          onChange={(evento) => alterar('repeticoes', evento.target.value)}
        />
        <Campo
          rotulo="Carga em kg (opcional)"
          name="carga"
          inputMode="decimal"
          disabled={salvando}
          value={campos.carga}
          erro={erros.carga}
          onChange={(evento) => alterar('carga', evento.target.value)}
        />
        <Campo
          rotulo="Descanso em s (opcional)"
          name="descanso"
          inputMode="numeric"
          disabled={salvando}
          value={campos.descanso}
          erro={erros.descanso}
          onChange={(evento) => alterar('descanso', evento.target.value)}
        />
      </div>

      <Campo
        rotulo="Observacao (opcional)"
        name="observacao"
        placeholder="Ex.: Controle a descida"
        disabled={salvando}
        value={campos.observacao}
        onChange={(evento) => alterar('observacao', evento.target.value)}
      />

      <div className="flex gap-2">
        <Botao type="submit" disabled={salvando} className="flex-1">
          {salvando ? 'Salvando...' : 'Salvar exercicio'}
        </Botao>
        <Botao
          variante="secundario"
          disabled={salvando}
          onClick={aoCancelar}
          className="flex-1"
        >
          Cancelar
        </Botao>
      </div>
    </form>
  )
}
