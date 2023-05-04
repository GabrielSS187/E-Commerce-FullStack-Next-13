import {
	expect,
	describe,
	it,
	vi,
	Mocked,
	beforeEach,
	afterEach,
	SpyInstance,
	Vitest,
} from "vitest";

import { usersDbMock } from "../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../repositories-in-memory/User-repository-in-memory";
import { UserLoginCase } from "../../use-cases/User-cases/User-login-case";
import { CreateUserCase } from "../../use-cases/User-cases/Create-user-case";
import { BCryptAdapter } from "../../../infra/adapters/BcryptAdapter/Bcrypt-adapter";
import { JwtAdapter } from "../../../infra/adapters/JwtAdapter/Jwt-adapter";
import { UserError } from "../../errors/User-error";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	const jwt = new JwtAdapter();
	const bcrypt = new BCryptAdapter();

	const sutUserLoginCase = new UserLoginCase(
		userRepositoryInMemory,
		bcrypt,
		jwt,
	);

	const sutCreateUserCase = new CreateUserCase(userRepositoryInMemory, bcrypt);

	return {
		sutUserLoginCase,
		sutCreateUserCase,
		jwt,
		bcrypt,
	};
};

describe("Test in the file User-login-case.", () => {
	const { bcrypt, jwt, sutUserLoginCase, sutCreateUserCase } = sutFactory();

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newUserData: any = {
		name: "Test Silva",
		email: "test@test.com",
		password: "12345bB/",
	};

	const dataUser = {
		email: "test@test.com",
		password: "12345bB/",
	};

	it("must return a JWT token after login.", async () => {
		const mockJwt = vi.spyOn(jwt, "generateToken");
		mockJwt.mockReturnValue("jwtToken");
    const mockBcrypt = vi.spyOn(bcrypt, "compareHash");

    await sutCreateUserCase.create(newUserData);
    const result = await sutUserLoginCase.login(dataUser);    

    expect(result).toEqual({
      statusCode: 200,
      token: "jwtToken",
    });
    expect(mockJwt).toHaveBeenCalledOnce();
    expect(mockBcrypt).toHaveBeenCalledOnce();

    mockJwt.mockRestore();
    mockBcrypt.mockRestore();

    expect.assertions(3);
	});
});
