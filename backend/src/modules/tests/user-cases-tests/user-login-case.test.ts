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

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const dataUser: any = {
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

	it("should throw an error if the email does not exist.", async () => {
		const mockBcrypt = vi.spyOn(bcrypt, "compareHash");
		const mockJwt = vi.spyOn(jwt, "generateToken");

		dataUser["email"] = "test_ff@gmail.com";

		try {
			await sutUserLoginCase.login(dataUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Usuário não encontrado.");
			expect(error.statusCode).toBe(404);
		}

		expect(mockBcrypt).not.toHaveBeenCalledOnce();
		expect(mockJwt).not.toHaveBeenCalled();

		expect.assertions(5);

		mockBcrypt.mockRestore();
		mockJwt.mockRestore();
	});

	it("should throw an error if the password is incorrect.", async () => {
		const mockBcrypt = vi.spyOn(bcrypt, "compareHash");
		const mockJwt = vi.spyOn(jwt, "generateToken");

		dataUser["email"] = "test@test.com";
		dataUser["password"] = "466372289";

		try {
			await sutUserLoginCase.login(dataUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Senha incorreta.");
			expect(error.statusCode).toBe(406);
		}

		expect(mockBcrypt).toHaveBeenCalledOnce();
		expect(mockJwt).not.toHaveBeenCalled();

		expect.assertions(5);

		mockBcrypt.mockRestore();
		mockJwt.mockRestore();
	});

	it("should throw an error if the email is not the correct regex.", async () => {
		const mockBcrypt = vi.spyOn(bcrypt, "compareHash");
		const mockJwt = vi.spyOn(jwt, "generateToken");

		dataUser["email"] = "testtest.com";

		try {
			await sutUserLoginCase.login(dataUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Email invalido.");
			expect(error.statusCode).toBe(406);
		}

		expect(mockBcrypt).not.toHaveBeenCalledOnce();
		expect(mockJwt).not.toHaveBeenCalled();

		expect.assertions(5);

		mockBcrypt.mockRestore();
		mockJwt.mockRestore();
	});

	it("Should throw an error if any property is missing.", async () => {
		const mockBcrypt = vi.spyOn(bcrypt, "compareHash");
		const mockJwt = vi.spyOn(jwt, "generateToken");

		dataUser["email"] = "test@test.com";
		dataUser["password"] = undefined;

		try {
			await sutUserLoginCase.login(dataUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Senha obrigatória.");
			expect(error.statusCode).toBe(406);
		}

		expect(mockBcrypt).not.toHaveBeenCalledOnce();
		expect(mockJwt).not.toHaveBeenCalled();

		expect.assertions(5);

		mockBcrypt.mockRestore();
		mockJwt.mockRestore();
	});
});
