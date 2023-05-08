import { Request, Response } from "express";
import { CreateUserCase } from "../use-cases/User-cases/Create-user-case";
import { UserLoginCase } from "../use-cases/User-cases/User-login-case";
import { CreateMoreUserInfoCase } from "../use-cases/User-cases/Create-more-user-info-case";
import { EditInfoUserCase } from "../use-cases/User-cases/Edit-info-user-case";
import { FindUserByTokenCase } from "../use-cases/User-cases/Find-user-by-token-case";
import { UserRepository } from "../repositories/mongoose/User-repository";
import { BCryptAdapter } from "../../infra/adapters/BcryptAdapter/Bcrypt-adapter";
import { JwtAdapter } from "../../infra/adapters/JwtAdapter/Jwt-adapter";

export class UserControllers {
	#userRepository = new UserRepository();
	#jwt = new JwtAdapter();
	#bcrypt = new BCryptAdapter();

	async create(req: Request, res: Response): Promise<Response> {
		const { name, email, password } = req.body;

		const createUser = new CreateUserCase(this.#userRepository, this.#bcrypt);

		const result = await createUser.create({
			name,
			email,
			password,
		});

		return res.status(201).json(result?.message);
	}

	async edit(request: Request, response: Response): Promise<Response> {}

	async login(request: Request, response: Response): Promise<Response> {}

	async createMoreInfo(
		request: Request,
		response: Response,
	): Promise<Response> {}

	async findByToken(request: Request, response: Response): Promise<Response> {}
}
