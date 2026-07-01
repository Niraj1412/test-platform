const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const generateAccessCode = (length = 6) => {
  let code = ''
  const cryptoApi = globalThis.crypto
  const values = new Uint32Array(length)
  cryptoApi.getRandomValues(values)
  values.forEach((value) => {
    code += ALPHABET[value % ALPHABET.length]
  })
  return code
}
