import * as yup from 'yup';

export const registerCallSchema = yup.object({
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
  cep: yup
    .string()
    .required('Campo obrigatório.')
    .min(8, 'CEP inválido.')
    .max(8, 'CEP inválido.'),
  neightborhood: yup
    .string()
    .required('Campo obrigatório.'),
  street: yup
    .string()
    .required('Campo obrigatório.'),
  number: yup
    .string()
    .typeError('Campo obrigatório.')
    .required('Campo obrigatório.'),
  complement: yup
    .string(),
  serviceTypeId: yup
    .number()
    .typeError('Campo obrigatório.')
    .required('Campo obrigatório.'),
  description: yup
    .string()
    .required('Campo obrigatório.'),
  isRecurringCall: yup
    .boolean()
    .required('Campo obrigatório.')
});

export const registerCallByAttendantSchema = registerCallSchema.concat( 
  yup.object({
    clientId: yup
      .string()
      .required("Campo obrigatório."),
    })
);