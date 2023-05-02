import { TUserExitDataDTO } from "../../../dtos/user-dto";

export const usersDbMock: TUserExitDataDTO[] = [
	{
		_id: "12345678",
		photo_url: "photo_url",
		name: "Gabriel",
		email: "gabriel@gmail.com",
		password: "6892012bJ/*",
		role: "normal",
		userMoreInfo: {
			_id: "6799020101b",
			userId: "123456789",
			address: "Rua da Esperança",
			city: "São Paulo",
			state: "SP",
			country: "Brasil",
			zipCode: "55555-555",
			phone: "99999-999",
		},
	},
];
