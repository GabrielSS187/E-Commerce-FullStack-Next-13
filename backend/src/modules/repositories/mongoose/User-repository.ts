import {
	TCreateUserDTO,
	TUserMoreInfoDTO,
	TEditUserDTO,
	TUserExitDataDTO,
} from "../../../dtos/user-dto";
import { UserContract } from "../User-contract";

export class UserRepository implements UserContract {
	async create(params: TCreateUserDTO): Promise<void> {
		// throw new Error("Method not implemented.");
	}

	async createMoreInfo(params: TUserMoreInfoDTO): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async edit(params: { idUser: string; newData: TEditUserDTO }): Promise<void> {
		console.log(params);
	}

	async delete(idUser: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async findUser(params: {
		idUser?: string;
		email?: string;
	}): Promise<TUserExitDataDTO | null> {
		throw new Error("Method not implemented.");
	}
}
