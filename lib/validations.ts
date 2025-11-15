import { z } from 'zod'

export const signUpFormSchema = z.object({
  email: z.string().nonempty('Email no puede estar vacío').email('Esto no es una dirección de correo válida'),
  password: z.string().nonempty('Contraseña no puede estar vacío').min(6, 'La contraseña no puede ser menor de 6 carácteres')
})

export const loginFormSchema = z.object({
  //email: z.email('Esto no es una dirección de correo válida').nonempty('Email no puede estar vacío'),
  email: z.string().nonempty('Email no puede estar vacío').email('Esto no es una dirección de correo válida'),
  password: z.string().nonempty('Contraseña no puede estar vacío').min(6, 'La contraseña no puede ser menor de 6 carácteres')
})