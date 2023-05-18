import { ZodError } from "zod";
import { UserContract } from "../../repositories/User-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { JwtContract } from "../../../infra/adapters/Jwt-contract";
import { TLoginUserRequest, loginUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class UserLoginCase {
	constructor(
		private readonly userContract: UserContract,
		private readonly bcryptContract: BCryptContract,
		private readonly jwtContract: JwtContract,
	) {}

	async login(request: TLoginUserRequest) {
		try {
			const { email, password } = loginUserSchema.parse(request);

			const user = await this.userContract.findUser({ email });

			if (!user) {
				throw new UserError("Usuário não encontrado.", 404);
			}

			const verifyPassword = await this.bcryptContract.compareHash({
				passwordDatabase: user.password,
				password,
			});

			if (!verifyPassword) {
				throw new UserError("Senha incorreta.", 406);
			}

			const generateTokenJwt = this.jwtContract.generateToken({
				userId: user._id,
				role: user.role,
			});

			return {
				statusCode: 200,
				access_token: generateTokenJwt,
			};
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
			if (error instanceof UserError) {
				throw new UserError(error.message, error.statusCode);
			}
			throw new Error(error.message);
		}
	}
}
