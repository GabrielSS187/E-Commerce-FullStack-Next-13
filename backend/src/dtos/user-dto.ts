type TId = string;

export type TCreateUserDTO = {
	photo_url: string;
	name: string;
	email: string;
	password: string;
	role: string | "normal" | "admin";
};

export type TUserMoreInfoDTO = {
	userId: TId;
	phone: string;
	zipCode: string;
	address: string;
	city: string;
	state: string;
	country: string;
};

export type TUserExitDataDTO = {
	_id: TId;
	userMoreInfo: { _id: TId } & TUserMoreInfoDTO;
} & TCreateUserDTO;
