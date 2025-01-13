import * as yup from 'yup';

const today = new Date();

export const personSchema = yup.object({
  name: yup
    .string()
    .required("Campo obrigatório."),
  rg: yup
    .string()
    .required("Campo obrigatório.")
    .max(9, "O RG deve ter no máximo 9 dígitos")
    .matches(/^[0-9]+$/, "RG deve conter apenas números"),
  cpf: yup
    .string()
    .required("Campo obrigatório.")
    .matches(/^[0-9]+$/, "CPF deve conter apenas números")
    .length(11, "O CPF deve ter exatamente 11 dígitos"),
  birthDate: yup
    .date()
    .typeError("Campo obrigatório.")
    .required("Campo obrigatório.")
    .max(today, "Data inválida."),
  phoneNumber: yup
    .string()
    .required("Campo obrigatório.")
    .matches(/^[0-9]+$/, "Telefone deve conter apenas números"),
  email: yup
    .string()
    .required("Campo obrigatório.")
    .email("Email deve ser válido")
    .test(
      'no-spaces',
      'O email não deve conter espaços',
      value => !/\s/.test(value)
    ),
  password: yup
    .string()
    .required("Campo obrigatório.")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: yup
    .string()
    .required("Campo obrigatório.")
    .oneOf([yup.ref('password'), null], 'As senhas devem coincidir')
});
