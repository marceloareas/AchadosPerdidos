import * as Yup from "yup";

const registerSchema = Yup.object({
  nome: Yup.string().required("O nome é obrigatório."),
  email: Yup.string()
    .email("Digite um email válido.")
    .required("O email é obrigatório."),
  senha: Yup.string()
    .required("A senha é obrigatória.")
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirm_senha: Yup.string()
    .oneOf([Yup.ref("senha"), null], "As senhas não coincidem.")
    .required("Confirme sua senha."),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Digite um email válido.")
    .required("O email é obrigatório."),
  senha: Yup.string().required("A senha é obrigatória."),
});

const itemSchema = Yup.object({
  nome: Yup.string().required("O nome do item é obrigatório."),
  descricao: Yup.string().required("A descrição é obrigatória."),
  categorias: Yup.array().required("A categoria é obrigatória."),
  localizacao: Yup.string().required("A localização é obrigatória."),
  dataEvento: Yup.date().required("A data é obrigatória."),
  // cor: Yup.string(),
});

export { registerSchema, loginSchema, itemSchema };
