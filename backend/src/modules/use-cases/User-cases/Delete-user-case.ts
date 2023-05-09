import { UserContract } from "../../repositories/User-contract";
import { AwsS3Contract } from "../../../infra/adapters/AwsS3-contract";
import { UserError } from "../../errors/User-error";

export class DeleteUserCase {
	constructor(
		private userContract: UserContract,
		private readonly awsS3Contract: AwsS3Contract,
	) {}

	async delete(request: { idUser: string }) {
		const user = await this.userContract.findUser({ idUser: request.idUser });
		if (!user) {
			throw new UserError("Usuário não encontrado.", 404);
		}

		await this.awsS3Contract.deleteFile(user.photo_url);
		await this.userContract.delete(request.idUser);

		return {
			statusCode: 200,
			message: "Usuário deletado com sucesso.",
		};
	}
}
