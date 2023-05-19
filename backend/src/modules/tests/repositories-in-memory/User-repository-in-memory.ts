import crypto from "node:crypto";
import {
  TCreateUserDTO,
  TUserMoreInfoDTO,
  TUserExitDataDTO,
  TEditUserDTO,
} from "../../../dtos/user-dto";
import { UserContract } from "../../../modules/repositories/User-contract";
import { usersDbMock } from "../database-in-memory/database-mock";

export class UserRepositoryInMemory implements UserContract {
  async create(params: TCreateUserDTO): Promise<void> {
    usersDbMock.push({
      _id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...params,
      userMoreInfo: null,
    });
  }

  async createMoreInfo(params: TUserMoreInfoDTO): Promise<void> {
    const { address, city, country, phone, state, userId, zipCode } = params;
    
    const user = usersDbMock.find((user) => user._id === userId);

    const newMoreInfo = {
      _id: `${crypto.randomUUID()}-info`,
      address,
      city,
      country,
      phone,
      state,
      userId,
      zipCode,
    };

    if (user?.userMoreInfo === null) user!.userMoreInfo = newMoreInfo;
  }

  async edit(params: { idUser: string; newData: TEditUserDTO }): Promise<void> {
    const user = usersDbMock.find((user) => user._id === params.idUser);
    const {
      photo_url,
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      state,
      zipCode,
    } = params.newData;

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

		photo_url && (user.photo_url = photo_url);
		name && (user.name = name);
		email && (user.email = email);
		password && (user.password = password);
		
    if (user.userMoreInfo) {
      address && (user.userMoreInfo.address = address);
      city && (user.userMoreInfo.city = city);
      country && (user.userMoreInfo.country = country);
      state && (user.userMoreInfo.state = state);
      zipCode && (user.userMoreInfo.zipCode = zipCode);
      phone && (user.userMoreInfo.phone = phone);
    }
  }

  async delete(idUser: string): Promise<void> {
    const indexUser = usersDbMock.findIndex((user) => user._id === idUser);
    usersDbMock.splice(indexUser, 1);
  }

  async findUser(params: {
    idUser?: string | undefined;
    email?: string | undefined;
  }): Promise<TUserExitDataDTO | null> {
    if (params.email) {
      const user = usersDbMock.find((user) => user.email === params.email);
      return user || null;
    }

    const user = usersDbMock.find((user) => user._id === params.idUser);
    return user || null;
  }
}
