import { useState } from 'react'
import type { FormEvent } from 'react'
import { Botao } from '@/shared/components/botao'
import { Campo } from '@/shared/components/campo'
import type { CamposTreino, ErrosTreino } from '../gestao-treinos.hook'

type FormularioTreinoProps = {
  valoresIniciais: CamposTreino
  erros: ErrosTreino
  salvando: boolean
  aoSalvar: (campos: CamposTreino) => void
  aoCancelar: () => void
}

export function FormularioTreino({
  valoresIniciais,
  erros,
  salvando,
  aoSalvar,
  aoCancelar,
}: FormularioTreinoProps) {
  const [campos, setCampos] = useState(valoresIniciais)

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    aoSalvar(campos)
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      <Campo
        rotulo="Nome do treino"
        name="nome"
        placeholder="Ex.: Treino A - Peito e Triceps"
        disabled={salvando}
        value={campos.nome}
        erro={erros.nome}
        onChange={(evento) =>
          setCampos((atuais) => ({ ...atuais, nome: evento.target.value }))
        }
      />
      <Campo
        rotulo="Objetivo"
        name="objetivo"
        placeholder="Ex.: Hipertrofia"
        disabled={salvando}
        value={campos.objetivo}
        erro={erros.objetivo}
        onChange={(evento) =>
          setCampos((atuais) => ({ ...atuais, objetivo: evento.target.value }))
        }
      />
      <div className="flex gap-2">
        <Botao type="submit" disabled={salvando} className="flex-1">
          {salvando ? 'Salvando...' : 'Salvar treino'}
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
