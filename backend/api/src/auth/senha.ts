import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const TAMANHO_CHAVE = 64;

export function gerarHashSenha(senha: string) {
  const sal = randomBytes(16).toString('hex');
  const chave = scryptSync(senha, sal, TAMANHO_CHAVE).toString('hex');

  return `scrypt$${sal}$${chave}`;
}

export function verificarSenha(senha: string, hashArmazenado: string) {
  const [algoritmo, sal, chave] = hashArmazenado.split('$');

  if (algoritmo !== 'scrypt' || !sal || !chave) {
    return false;
  }

  const esperada = Buffer.from(chave, 'hex');
  const calculada = scryptSync(senha, sal, esperada.length);

  return timingSafeEqual(esperada, calculada);
}
