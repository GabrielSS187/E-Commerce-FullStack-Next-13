type IdMongoDB = {
	_id: string;
};

export type CreateUserDTO = {
	photo_url: string;
	name: string;
	email: string;
	password: string;
	role: "normal" | "admin";
};

export type UserMoreInfoDTO = {
	userId: string;
	phone: string;
	zipCode: string;
	address: string;
	city: string;
	state: string;
	country: string;
};

export type UserExitDataDTO = {
	_id: IdMongoDB;
	userMoreInfo: IdMongoDB & UserMoreInfoDTO;
} & CreateUserDTO;
