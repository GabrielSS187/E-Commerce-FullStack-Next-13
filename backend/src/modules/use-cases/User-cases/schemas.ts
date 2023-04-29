import { string, z } from "zod";

//* Pelo menos uma letra maiúscula, Pelo menos uma letra minúscula, Pelo menos um dígito
//* Pelo menos um caractere especial, Comprimento mínimo de oito.
export const regexValidatePassword =
	/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g;

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
		.max(35, { message: "Nome tem que ter no máximo 35 caracteres." }),
	email: string({ required_error: "Email obrigatório." })
		.trim()
		.email({ message: "Email invalido." }),
	password: string({ required_error: "Senha obrigatória." })
		.trim()
		.regex(regexValidatePassword, {
			message:
				"Senha deve conter no máximo: 1 Letra maiúscula e minúscula, 1 número e 1 carácter especial.",
		})
		.min(6, { message: "O mínimo de caracteres da senha é 6." })
		.max(8, { message: "O máxima de caracteres da senha é 8." }),
	role: string().trim().optional().default("normal"),
});

export const loginUserSchema = z.object({
	email: string({ required_error: "Email obrigatório." })
		.trim()
		.email({ message: "Email invalido." }),
	password: string({ required_error: "Senha obrigatória." }).trim(),
});

export type TCreateUserRequest = z.infer<typeof createUserSchema>;
export type TLoginUserRequest = z.infer<typeof loginUserSchema>;
