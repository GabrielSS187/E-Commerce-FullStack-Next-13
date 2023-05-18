import { Request, Response } from "express";
import { env } from "process";
import { config } from "dotenv";
import { CreateUserCase } from "../use-cases/User-cases/Create-user-case";
import { UserLoginCase } from "../use-cases/User-cases/User-login-case";
import { EditInfoUserCase } from "../use-cases/User-cases/Edit-info-user-case";
import { DeleteUserCase } from "../use-cases/User-cases/Delete-user-case";
import { FindUserByTokenCase } from "../use-cases/User-cases/Find-user-by-token-case";
import { UserRepository } from "../repositories/mongoose/User-repository";
import { JwtAdapter } from "../../infra/adapters/Jwt-adapter/Jwt-adapter";
import { BCryptAdapter } from "../../infra/adapters/Bcrypt-adapter/Bcrypt-adapter";
import { AwsS3Adapter } from "../../infra/adapters/AwsS3-adapter/AwsS3-adapter";

config();

const userRepository = new UserRepository();
const jwt = new JwtAdapter();
const bcrypt = new BCryptAdapter();
const awsS3 = new AwsS3Adapter();

export class UserControllers {
	async create(req: Request, res: Response): Promise<Response> {
		const {
			name,
			email,
			password,
			address,
			city,
			country,
			phone,
			state,
			zipCode,
		} = req.body;

		const createUser = new CreateUserCase(userRepository, bcrypt);

		const result = await createUser.create({
			name,
			email,
			password,
			address,
			city,
			country,
			phone,
			state,
			zipCode,
		});

		return res.status(result.statusCode).json(result.message);
	}

	async edit(req: Request, res: Response): Promise<Response> {
		const { idUser } = req;
		let {
			photo_url,
			name,
			email,
			password,
			phone,
			zipCode,
			address,
			city,
			state,
			country,
		} = req.body;

		if (req.file) {
			const requestPhoto: Express.Multer.File = req.file;
			photo_url = `${env.AWS_URL}/${requestPhoto.originalname}`;
		}

		const editInfoUserCase = new EditInfoUserCase(
			userRepository,
			bcrypt,
			awsS3,
		);

		const result = await editInfoUserCase.edit(idUser, {
			photo_url,
			name,
			email,
			password,
			phone,
			zipCode,
			address,
			city,
			state,
			country,
		});

		return res.status(result.statusCode).json(result.message);
	}

	async delete(req: Request, res: Response) {
		const { idUser } = req;

		const deleteUserCase = new DeleteUserCase(userRepository, awsS3);

		const result = await deleteUserCase.delete({ idUser });

		return res.status(result.statusCode).json(result.message);
	}

	async login(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;

		const userLoginCase = new UserLoginCase(userRepository, bcrypt, jwt);

		const result = await userLoginCase.login({
			email,
			password,
		});

		return res.status(result.statusCode).json({
			access_token: result.access_token 
		});
	}

	async findByToken(req: Request, res: Response): Promise<Response> {
		const { idUser } = req;

		const findUserByTokenCase = new FindUserByTokenCase(userRepository);

		const result = await findUserByTokenCase.find({
			userId: idUser,
		});

		return res.status(result.statusCode).json(result.user);
	}
}
