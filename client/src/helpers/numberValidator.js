export function numberValidator(number) {
    number = number.toString()
    if (!number) return "El numero no puede estar vacio"
    if (number.length < 9 || number.length > 10) return 'Ingrese un numero valido'
    return ''
  }
  