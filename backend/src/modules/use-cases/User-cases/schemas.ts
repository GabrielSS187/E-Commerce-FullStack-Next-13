import { string, z } from "zod";

//* Pelo menos uma letra maiúscula, Pelo menos uma letra minúscula, Pelo menos um dígito
//* Pelo menos um caractere especial, Comprimento mínimo de oito.
const regexValidatePassword =
	/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g;
const regexValidatePhone = /^([1-9]{2})9\d{8}$/;
const regexValidateCep = /^\d{8}$/;

export const createUserSchema = z.object({
	photo_url: string()
		.trim()
		.optional()
		.default(
			"https://pt.seaicons.com/wp-content/uploads/2015/06/person-icon.png",
		),
	name: string({ required_error: "Nome obrigatório." })
		.trim()
		.min(5, { message: "Nome tem que ter no mínimo 5 caracteres." })
		.max(35, { message: "Nome tem que ter no máximo 35 caracteres." })
		.transform((srt) => srt.charAt(0).toUpperCase() + srt.slice(1)),
	email: string({ required_error: "Email obrigatório." })
		.trim()
		.email({ message: "Email invalido." }),
	password: string({ required_error: "Senha obrigatória." })
		.trim()
		.min(6, { message: "O mínimo de caracteres da senha é 6." })
		.regex(regexValidatePassword, {
			message:
				"Senha deve conter no máximo: 1 Letra maiúscula e minúscula, 1 número e 1 carácter especial é sem espaços.",
		})
		.max(8, { message: "O máxima de caracteres da senha é 8." }),
	role: string().trim().optional().default("normal"),
});

export const loginUserSchema = z.object({
	email: string({ required_error: "Email obrigatório." })
		.trim()
		.email({ message: "Email invalido." }),
	password: string({ required_error: "Senha obrigatória." }).trim(),
});

export const createMoreUserInfoSchema = z.object({
	userId: string({ required_error: "userId obrigatório." }).trim(),
	phone: string({ required_error: "Número de celular obrigatório." })
		.trim()
		.regex(regexValidatePhone, {
			message: "Esse número de celular não é valido.",
		})
		.transform((srt) => `+55${srt}`),
	zipCode: string({ required_error: "Cep obrigatório." })
		.trim()
		.regex(regexValidateCep, { message: "Cep invalido." }),
	address: string({ required_error: "Endereço obrigatório." })
		.trim()
		.min(2, { message: "Endereço no mínimo 2 caracteres." }),
	city: string({ required_error: "Cidade obrigatório." })
		.trim()
		.min(2, { message: "Cidade no mínimo 2 caracteres." }),
	state: string({ required_error: "Estado obrigatório." })
		.trim()
		.min(2, { message: "Estado o mínimo de caracteres é 2." })
		.max(2, { message: "Estado o máximo de caracteres é 2." })
		.transform((srt) => srt.toLocaleUpperCase()),
	country: string({ required_error: "País obrigatório." })
		.trim()
		.min(2, { message: "País o mínimo de caracteres é 2." })
		.max(2, { message: "País o máximo de caracteres é 2." })
		.transform((srt) => srt.toLocaleUpperCase()),
});

export const editInfoUserSchema = createUserSchema
	.omit({ role: true })
	.extend({ userMoreInfo: createMoreUserInfoSchema.omit({ userId: true }).partial() })
	.partial();

export type TCreateUserRequest = z.infer<typeof createUserSchema>;
export type TLoginUserRequest = z.infer<typeof loginUserSchema>;
export type TCreateMoreUserInfoRequest = z.infer<
	typeof createMoreUserInfoSchema
>;
export type TEditInfoUserRequest = z.infer<typeof editInfoUserSchema>;
