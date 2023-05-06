import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
import { UserContract } from "../../repositories/User-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { JwtContract } from "../../../infra/adapters/Jwt-contract";
import { TEditInfoUserRequest, editInfoUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class EditInfoUserCase {
	constructor(
		private readonly userContract: UserContract,
		private readonly jwtContract: JwtContract,
		private readonly bcryptContract: BCryptContract,
	) {}

	async edit(token: string, request: TEditInfoUserRequest) {
		try {
			if (token.length === 0) {
				throw new UserError("Token JWT obrigatório.", 401);
			}

			const decryptTokenJwt = this.jwtContract.getToken({ token });

			const user = await this.userContract.findUser({
				idUser: decryptTokenJwt.userId,
			});
			if (!user) throw new UserError("Usuário não encontrado.", 404);

			const { photo_url, name, email, password, userMoreInfo } =
				editInfoUserSchema.parse(request);

			if (email) {
				const user = await this.userContract.findUser({ email });
				if (user) {
					throw new UserError(
						"Já existe um usuário cadastrado com esse email.",
						409,
					);
				}
			}

			let newPassword: string | undefined;
			if (password) {
				newPassword = await this.bcryptContract.hashEncrypt({ password });
			}

			await this.userContract.edit({
				idUser: decryptTokenJwt.userId,
				newData: {
					photo_url,
					name,
					email,
					password: newPassword,
					userMoreInfo,
				},
			});

			return {
				statusCode: 200,
				message: "Informações editadas com sucesso.",
			};
		} catch (error) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
			if (error instanceof JsonWebTokenError) {
				throw new UserError(error.message, 401);
			}
			if (error instanceof UserError) {
				throw new UserError(error.message, error.statusCode);
			}
		}
	}
}
