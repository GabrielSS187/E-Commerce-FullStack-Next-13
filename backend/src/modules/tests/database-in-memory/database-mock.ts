import { TUserExitDataDTO } from "../../../dtos/user-dto";

export const usersDbMock: TUserExitDataDTO[] = [
	{
		_id: "12345678",
		photo_url: "photo_url",
		name: "Gabriel",
		email: "gabriel@gmail.com",
		password: "6892012bJ/*",
		role: "normal",
		createdAt: new Date("2023-04-11T00:32:10.000+00:00"),
		updatedAt: new Date("2023-04-11T00:32:10.000+00:00"),
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
	{
		_id: "123475777432",
		photo_url: "photo_url",
		name: "Jéssica",
		email: "jessica@gmail.com",
		password: "6892012bJ/*",
		role: "normal",
		createdAt: new Date("2023-04-11T00:32:10.000+00:00"),
		updatedAt: new Date("2023-04-11T00:32:10.000+00:00"),
		userMoreInfo: undefined,
	},
];
