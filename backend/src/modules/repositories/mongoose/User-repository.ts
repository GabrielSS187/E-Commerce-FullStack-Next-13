import { UserSchema, CreateMoreInfoSchema } from "../../models/User-models";
import {
	TCreateUserDTO,
	TUserMoreInfoDTO,
	TEditUserDTO,
	TUserExitDataDTO,
} from "../../../dtos/user-dto";
import { UserContract } from "../User-contract";

export class UserRepository implements UserContract {
	async create(params: TCreateUserDTO): Promise<void> {
		await UserSchema.create(params);
	}

	async createMoreInfo(params: TUserMoreInfoDTO): Promise<void> {
		await CreateMoreInfoSchema.create(params);
	}

	async edit(params: { idUser: string; newData: TEditUserDTO }): Promise<void> {
		await UserSchema.updateOne(
			{ _id: params.idUser },
			{ $set: params.newData },
		);

		if (params.newData.userMoreInfo){
			const user = await this.findUser({ idUser: params.idUser });

			await CreateMoreInfoSchema.updateOne(
				{ _id: user?.userMoreInfo?._id },
				{ $set: params.newData.userMoreInfo },
			);
		}
	}

	async delete(idUser: string): Promise<void> {
		await UserSchema.deleteOne({ _id: idUser });
	}

	async findUser(params: {
		idUser?: string;
		email?: string;
	}): Promise<TUserExitDataDTO | null> {
		if (params.email) {
			const user = await UserSchema.findOne({ email: params.email })
				.lean<TUserExitDataDTO>()
				.exec();
			return user;
		}

		const user = await UserSchema.findById(params.idUser)
			.lean<TUserExitDataDTO>()
			.exec();
		return user;
	}
}
