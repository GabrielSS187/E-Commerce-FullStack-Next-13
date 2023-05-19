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

export type TMoreInfoDTO = Omit<TUserMoreInfoDTO, "userId"> | null;

export type TUserExitDataDTO = {
	_id: TId;
	createdAt: Date;
	updatedAt: Date;
	userMoreInfo: TMoreInfoDTO;
} & TCreateUserDTO;

export type TEditUserDTO = {
	photo_url?: string;
	name?: string;
	email?: string;
	password?: string;
	phone?: string;
	zipCode?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
};
