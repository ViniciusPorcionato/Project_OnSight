import * as yup from 'yup';

export const clientSchema = yup.object().shape({
  tradeName: yup
    .string()
    .required('Campo obrigatório.'),
  companyName: yup
    .string()
    .required('Campo obrigatório.'),
  cnpj: yup
    .string()
    .matches(/^\d{14}$/, 'CNPJ deve ter 14 dígitos.')
    .required('Campo obrigatório.'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10,11}$/, 'Número de telefone inválido.')
    .required('Campo obrigatório.'),
  email: yup
    .string()
    .email('Por favor, insira um e-mail válido.')
    .required('Campo obrigatório.'),
  password: yup
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .required('Campo obrigatório.'),
  confirmPassword: yup
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .required('Campo obrigatório.')
    .oneOf([yup.ref('password'), null], 'As senhas devem coincidir')
});
