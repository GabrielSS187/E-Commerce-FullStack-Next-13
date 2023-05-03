import {
	TCreateUserDTO,
	TUserMoreInfoDTO,
	TUserExitDataDTO,
  TEditUserDTO,
} from "../../dtos/user-dto";

type TEditUser = {
  idUser: string;
  newData: TEditUserDTO;
}

type TFindUser = {
  idUser?: string;
  email?: string;
}

export abstract class UserContract {
	abstract create(params: TCreateUserDTO): Promise<void>;
  abstract createMoreInfo(params: TUserMoreInfoDTO): Promise<void>;
	abstract edit( params: TEditUser ): Promise<void>;
  abstract delete( idUser: string ): Promise<void>;
  abstract findUser( params: TFindUser ): Promise<TUserExitDataDTO | null>;
}
