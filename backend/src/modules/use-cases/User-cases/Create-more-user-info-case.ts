import { ZodError } from "zod";
import { UserContract } from "../../repositories/User-contract";
import {
	TCreateMoreUserInfoRequest,
	createMoreUserInfoSchema,
} from "./schemas";
import { UserError } from "../../errors/User-error";

export class CreateMoreUserInfoCase {
	constructor(private readonly userContract: UserContract) {}

	async create(request: TCreateMoreUserInfoRequest) {
		try {
			const { userId, address, city, country, phone, state, zipCode } =
				createMoreUserInfoSchema.parse(request);

			const user = await this.userContract.findUser({ idUser: userId });

			if (!user) throw new UserError("Usuário não encontrado.", 404);

			await this.userContract.createMoreInfo({
				userId,
				address,
				city,
				country,
				phone,
				state,
				zipCode,
			});

			return {
				statusCode: 201,
				message: "Criado com sucesso.",
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
