import {
	TCreateUserDTO,
	TUserMoreInfoDTO,
	TEditUserDTO,
	TUserExitDataDTO,
} from "../../../dtos/user-dto";
import { UserContract } from "../User-contract";

export class UserRepository implements UserContract {
	create(params: TCreateUserDTO): Promise<void> {
		throw new Error("Method not implemented.");
	}
	createMoreInfo(params: TUserMoreInfoDTO): Promise<void> {
		throw new Error("Method not implemented.");
	}
	edit(params: { idUser: string; newData: TEditUserDTO }): Promise<void> {
		throw new Error("Method not implemented.");
	}
	delete(idUser: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	findUser(params: {
		idUser?: string;
		email?: string;
	}): Promise<TUserExitDataDTO | null> {
		throw new Error("Method not implemented.");
	}
}
