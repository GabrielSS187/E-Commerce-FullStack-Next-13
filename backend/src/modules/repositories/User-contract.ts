import {
	TCreateUserDTO,
	TUserMoreInfoDTO,
	TUserExitDataDTO,
} from "../../dtos/user-dto";

type TEditUser = {
  idUser: string;
  newData: TCreateUserDTO & TUserMoreInfoDTO;
}

type TFindUser = {
  idUser?: string;
  email?: string;
}

export abstract class UserContract {
	abstract create(params: TCreateUserDTO): Promise<void>;
	abstract edit( params: TEditUser ): Promise<void>;
  abstract delete( idUser: string ): Promise<void>;
  abstract findUser( params: TFindUser ): Promise<TUserExitDataDTO | null>;
}
