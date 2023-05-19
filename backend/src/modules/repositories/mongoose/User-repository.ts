import { UserSchema, UserMoreInfoSchema } from "../../models/User-models";
import {
  TCreateUserDTO,
  TUserMoreInfoDTO,
  TEditUserDTO,
  TUserExitDataDTO,
  TMoreInfoDTO,
} from "../../../dtos/user-dto";
import { UserContract } from "../User-contract";

export class UserRepository implements UserContract {
  async create(params: TCreateUserDTO): Promise<void> {
    await UserSchema.create(params);
  }

  async createMoreInfo(params: TUserMoreInfoDTO): Promise<void> {
    await UserMoreInfoSchema.create(params);
  }

  async edit(params: { idUser: string; newData: TEditUserDTO }): Promise<void> {
    await Promise.all([
      UserSchema.updateOne({ _id: params.idUser }, { $set: params.newData }),
      UserMoreInfoSchema.updateOne(
        { userId: params.idUser },
        { $set: params.newData }
      ),
    ]);
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
        .select("-__v")
        .lean<TUserExitDataDTO>()
        .exec();
      return user;
    }

    const user = await UserSchema.findById({ _id: params.idUser })
      .select("-__v")
      .lean<TUserExitDataDTO>()
      .exec();

    const moreInfo = await UserMoreInfoSchema.findOne({ userId: user?._id })
      .select("-__v -userId -_id")
      .lean<TMoreInfoDTO>()
      .exec();

    if (!user) {
      return null;
    }

    return { ...user, userMoreInfo: moreInfo };
  }
}
