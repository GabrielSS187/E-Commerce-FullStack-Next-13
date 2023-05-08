import { JsonWebTokenError } from "jsonwebtoken";
import { UserContract } from "../../repositories/User-contract";
import { JwtContract } from "../../../infra/adapters/Jwt-contract";
import { UserError } from "../../errors/User-error";

export class FindUserByTokenCase {
	constructor(private readonly userContract: UserContract) {}

	async find(request: { userId: string }) {
		try {
			const user = await this.userContract.findUser({
				idUser: request.userId,
			});

			if (!user) {
				throw new UserError("Usuário não encontrado.", 404);
			}

			return {
				statusCode: 200,
				user,
			};
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
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
