import { UserContract } from "../../repositories/User-contract";
import { UserError } from "../../errors/User-error";

export class DeleteUserCase {
	constructor(private userContract: UserContract) {}

	async delete(request: { idUser: string }) {
		const user = await this.userContract.findUser({ idUser: request.idUser });
		if (!user) {
			throw new UserError("Usuário não encontrado.", 404);
		}

		await this.userContract.delete(request.idUser);

		return {
			statusCode: 200,
			message: "Usuário deletado com sucesso.",
		};
	}
}
