export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "El email no puede estar vacio."
  if (!re.test(email)) return 'Email no valido'
  return ''
}
