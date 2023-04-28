type IdMongoDB = {
	_id: string;
};

type CreateUserDTO = {
	photo_url: string;
	name: string;
	email: string;
	password: string;
	role: "normal" | "admin";
};

type UserMoreInfoDTO = {
	userId: string;
	phone: string;
	zipCode: string;
	address: string;
	city: string;
	state: string;
	country: string;
};

type UserExitDataDTO = {
	_id: IdMongoDB;
	userMoreInfo: IdMongoDB & UserMoreInfoDTO;
} & CreateUserDTO;
