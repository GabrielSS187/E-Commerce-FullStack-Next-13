import { expect, describe, it, vi } from "vitest";

import { usersDbMock } from "../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../repositories-in-memory/User-repository-in-memory";
import { UserLoginCase } from "../../use-cases/User-cases/User-login-case";
import { CreateUserCase } from "../../use-cases/User-cases/Create-user-case";
import { FindUserByTokenCase } from "../../use-cases/User-cases/Find-user-by-token-case";
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
	const sutFindUserByToken = new FindUserByTokenCase(
		userRepositoryInMemory,
		jwt,
	);

	return {
		sutUserLoginCase,
		sutCreateUserCase,
		sutFindUserByToken,
		jwt,
		bcrypt,
	};
};

describe("Test in the file Find-user-by-token", () => {
	const {
		bcrypt,
		jwt,
		sutUserLoginCase,
		sutCreateUserCase,
		sutFindUserByToken,
	} = sutFactory();

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

	it("should return a user if the JWT token is correct.", async () => {
		const mockJwt = vi.spyOn(jwt, "getToken");
		const mockBcrypt = vi.spyOn(bcrypt, "compareHash");

		await sutCreateUserCase.create(newUserData);
		const loginUser = await sutUserLoginCase.login(dataUser);
		const result = await sutFindUserByToken.find({
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			token: loginUser!.token,
		});
		const searchNewUser = usersDbMock.find(
			(user) => user.email === dataUser.email,
		);

		expect(result).toEqual({
			statusCode: 200,
			user: searchNewUser,
		});
		expect(result?.user).toEqual(searchNewUser);
		expect(mockJwt).toHaveBeenCalledOnce();
		expect(mockBcrypt).toHaveBeenCalledOnce();

		mockJwt.mockRestore();
		mockBcrypt.mockRestore();

		expect.assertions(4);
	});

	it("should throw an error if you don't have JWT token", async () => {
		const mockJwt = vi.spyOn(jwt, "getToken");

		try {
			await sutFindUserByToken.find({ token: "" });
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Token obrigatório.");
			expect(error.statusCode).toBe(401);
		}

		expect(mockJwt).not.toHaveBeenCalledOnce();

		mockJwt.mockRestore();

		expect.assertions(4);
	});

	it("it should throw an error if the JWT token is expired or invalid.", async () => {
		const mockJwt = vi.spyOn(jwt, "getToken");

		try {
			await sutFindUserByToken.find({ token: "invalid_token" });
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBeDefined();
			expect(error.statusCode).toBe(401);
		}

		expect(mockJwt).toHaveBeenCalledOnce();

		mockJwt.mockRestore();

		expect.assertions(4);
	});
});
