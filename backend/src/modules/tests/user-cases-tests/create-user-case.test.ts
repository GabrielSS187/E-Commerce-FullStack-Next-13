import { expect, describe, it, vi } from "vitest";

import { usersDbMock } from "../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../repositories-in-memory/User-repository-in-memory";
import { CreateUserCase } from "../../use-cases/User-cases/Create-user-case";
import { BCryptAdapter } from "../../../infra/adapters/BcryptAdapter/Bcrypt-adapter";
import { UserError } from "../../errors/User-error";
import { ZodError } from "zod";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	const bcrypt = new BCryptAdapter();

	const sutCreateUserCase = new CreateUserCase(userRepositoryInMemory, bcrypt);

	return {
		sutCreateUserCase,
		bcrypt,
	};
};

describe("Tests in the file Create-user-case.", () => {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newUser: any = {
		name: "Test Silva",
		email: "test@test.com",
		password: "12345bB/",
	};

	it("should create a user without errors", async () => {
		const { sutCreateUserCase, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const result = await sutCreateUserCase.create(newUser);
		const user = usersDbMock.find((user) => user.email === newUser.email);

		expect(result).toEqual({
			message: "Usuário criado com sucesso.",
			statusCode: 201,
		});
		expect(spyHashEncrypt).toHaveBeenCalledOnce();
		expect(usersDbMock).toHaveLength(2);
		expect(user).toBeDefined();
		expect(user).toHaveProperty("_id");
		expect(user).toHaveProperty("photo_url");
		expect(user).toHaveProperty("role");
		expect(user?.role).toBe("normal");
		expect(user?.password).toHaveLength(60);

		spyHashEncrypt.mockRestore();
	});

	it("should throw an error if a property is missing", async () => {
		const { sutCreateUserCase, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		newUser["email"] = undefined;

		try {
			const result = await sutCreateUserCase.create(newUser);
			expect(result).not.toBe(201);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.message).toBe("Email obrigatório.");
			expect(error.statusCode).toBe(406);
		}

		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(2);

		spyHashEncrypt.mockRestore();
	});
});
