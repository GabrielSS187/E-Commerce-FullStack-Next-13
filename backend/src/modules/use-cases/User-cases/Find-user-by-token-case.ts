import { JsonWebTokenError } from "jsonwebtoken";
import { UserContract } from "../../repositories/User-contract";
import { JwtContract } from "../../../infra/adapters/Jwt-contract";
import { UserError } from "../../errors/User-error";

export class FindUserByTokenCase {
	constructor(
		private readonly userContract: UserContract,
		private readonly jwtContract: JwtContract,
	) {}

	async find(request: { token: string }) {
		try {
			const { token } = request;

			if (token.length === 0) {
				throw new UserError("Token obrigatório.", 401);
			}

			const decryptToken = this.jwtContract.getToken({ token });

			const user = await this.userContract.findUser({
				idUser: decryptToken.userId,
			});

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
