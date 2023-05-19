import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
import { UserContract } from "../../repositories/User-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { AwsS3Contract } from "../../../infra/adapters/AwsS3-contract";
import { TEditInfoUserRequest, editInfoUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class EditInfoUserCase {
	constructor(
		private readonly userContract: UserContract,
		private readonly bcryptContract: BCryptContract,
		private readonly awsS3Contract: AwsS3Contract,
	) {}

	async edit(idUser: string, request: TEditInfoUserRequest) {
		try {
			const user = await this.userContract.findUser({ idUser });
			if (!user) throw new UserError("Usuário não encontrado.", 404);

			const {
				photo_url,
				name,
				email,
				password,
				phone,
				zipCode,
				address,
				city,
				state,
				country,
			} = editInfoUserSchema.parse(request);

			if (email) {
				const user = await this.userContract.findUser({ email });
				if (user) {
					throw new UserError(
						"Já existe um usuário cadastrado com esse email.",
						409,
					);
				}
			}

			if (photo_url) {
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				if (user.photo_url.includes(process.env.AWS_URL!)) {
					const fileName = user.photo_url?.replace(
						`${process.env.AWS_URL}/`,
						"",
					);
					await this.awsS3Contract.deleteFile(fileName);
				}
			}

			let newPassword: string | undefined;
			if (password) {
				newPassword = await this.bcryptContract.hashEncrypt({ password });
			}

			await this.userContract.edit({
				idUser,
				newData: {
					photo_url,
					name,
					email,
					password: newPassword,
					phone,
					zipCode,
					address,
					city,
					state,
					country,
				},
			});

			return {
				statusCode: 200,
				message: "Informações editadas com sucesso.",
			};
		} catch (error: any) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
			if (error instanceof JsonWebTokenError) {
				throw new UserError(error.message, 401);
			}
			if (error instanceof UserError) {
				throw new UserError(error.message, error.statusCode);
			}
			throw new Error(error.message);
		}
	}
}
