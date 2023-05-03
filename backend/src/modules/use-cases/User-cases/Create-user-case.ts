import { ZodError } from "zod";
import { UserContract } from "../../repositories/User-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { TCreateUserRequest, createUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class CreateUserCase {
	constructor(
		private userContract: UserContract,
		private bcrypt: BCryptContract,
	) {}

	async create(request: TCreateUserRequest) {
		try {
			const { photo_url, name, email, password, role } =
				createUserSchema.parse(request);

      const userEmail = await this.userContract.findUser({ email }); 
      if ( userEmail ) {
        throw new UserError("Já existe um usuário cadastrado com esse email.", 409);
      }

			const hashPassword = await this.bcrypt.hashEncrypt({ password });

			await this.userContract.create({
				photo_url,
				name,
				email,
				password: hashPassword,
				role,
			});

      return {
        message: "Usuário criado com sucesso.",
        statusCode: 201,
      };
		} catch (error) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
			if (error instanceof UserError) {
				throw new UserError(error.message, error.statusCode);
			}
		}
	}
}
