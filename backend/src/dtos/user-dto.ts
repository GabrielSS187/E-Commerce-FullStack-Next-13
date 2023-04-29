type TIdMongoDB = {
	_id: string;
};

export type TCreateUserDTO = {
	photo_url: string;
	name: string;
	email: string;
	password: string;
	role: "normal" | "admin";
};

export type TUserMoreInfoDTO = {
	userId: string;
	phone: string;
	zipCode: string;
	address: string;
	city: string;
	state: string;
	country: string;
};

export type TUserExitDataDTO = {
	_id: TIdMongoDB;
	userMoreInfo: TIdMongoDB & TUserMoreInfoDTO;
} & TCreateUserDTO;
