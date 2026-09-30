export function lerJson<T>(chave: string) {
  const valorGuardado = window.localStorage.getItem(chave)

  if (!valorGuardado) {
    return null
  }

  try {
    return JSON.parse(valorGuardado) as T
  } catch {
    window.localStorage.removeItem(chave)
    return null
  }
}

export function gravarJson(chave: string, valor: unknown) {
  window.localStorage.setItem(chave, JSON.stringify(valor))
}

export function removerItem(chave: string) {
  window.localStorage.removeItem(chave)
}
