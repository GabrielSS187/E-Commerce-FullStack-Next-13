import { expect, describe, it, vi } from "vitest";

import { UserRepositoryInMemory } from "../../repositories-in-memory/User-repository-in-memory";
import { UserLoginCase } from "../../../use-cases/User-cases/User-login-case";
import { CreateUserCase } from "../../../use-cases/User-cases/Create-user-case";
import { BCryptAdapter } from "../../../../infra/adapters/BcryptAdapter/Bcrypt-adapter";
import { CreateMoreUserInfoCase } from "../../../use-cases/User-cases/Create-more-user-info-case";
import { EditInfoUserCase } from "../../../use-cases/User-cases/Edit-info-user-case";
import { JwtAdapter } from "../../../../infra/adapters/JwtAdapter/Jwt-adapter";
import { UserError } from "../../../errors/User-error";
import { usersDbMock } from "../../database-in-memory/database-mock";

const sutFactory = () => {
	const bcrypt = new BCryptAdapter();
	const jwt = new JwtAdapter();
	const userRepositoryInMemory = new UserRepositoryInMemory();

	const sutUserLoginCase = new UserLoginCase(
		userRepositoryInMemory,
		bcrypt,
		jwt,
	);

	const sutCreateUserCase = new CreateUserCase(userRepositoryInMemory, bcrypt);
	const sutCreateMoreUserInfoCase = new CreateMoreUserInfoCase(
		userRepositoryInMemory,
	);
	const sutEditInfoUserCase = new EditInfoUserCase(
		userRepositoryInMemory,
		jwt,
		bcrypt,
	);

	return {
		sutCreateUserCase,
		sutUserLoginCase,
		sutEditInfoUserCase,
		sutCreateMoreUserInfoCase,
		jwt,
		bcrypt,
	};
};

describe("", async () => {
	const {
		bcrypt,
		jwt,
		sutCreateUserCase,
		sutEditInfoUserCase,
		sutUserLoginCase,
		sutCreateMoreUserInfoCase,
	} = sutFactory();

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newUser: any = {
		name: "Test Silva",
		email: "test@test.com",
		password: "12345bB/",
	};
	await sutCreateUserCase.create(newUser);
	const user = usersDbMock.find((user) => user.email === newUser.email);

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newInfo: any = {
		userId: user?._id,
		address: "Rua test, 123",
		city: "Cidade Test",
		country: "br",
		phone: "83982715054",
		state: "sp",
		zipCode: "55555555",
	};

	await sutCreateMoreUserInfoCase.create(newInfo);
	const resUserLogin = await sutUserLoginCase.login({
		email: newUser.email,
		password: newUser.password,
	});

	it("must edit user without throwing errors.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		const result = await sutEditInfoUserCase.edit(resUserLogin!.token, {
			name: "Edit Test",
			userMoreInfo: {
				city: "Edite Cidade Teste",
			},
		});

		expect(result).toEqual({
			statusCode: 200,
			message: "Informações editadas com sucesso.",
		});
		expect(user?.name).toBe("Edit Test");
		expect(user?.userMoreInfo?.city).toBe("Edite Cidade Teste");
		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("should throw an error if the properties: photo_url, name, email, password exist but have no value.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				password: "",
			});
			throw new Error("Teste failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("O mínimo de caracteres da senha é 6.");
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("should throw an error if the properties of obj: userMoreInfo, exist but do not have values.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				userMoreInfo: {
					city: "",
				},
			});
			throw new Error("Teste failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Cidade no mínimo 2 caracteres.");
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("must call the function: hashEncrypt, if there is a new password.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		//* Antes
		const copyUser = { ...user };
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		const result = await sutEditInfoUserCase.edit(resUserLogin!.token!, {
			//* Depois
			password: "17171jA/",
		});

		expect(result).toEqual({
			statusCode: 200,
			message: "Informações editadas com sucesso.",
		});
		expect(user?.password).not.toBe(copyUser.password);
		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).toHaveBeenCalledOnce();

		expect.assertions(4);
	});

	it("should throw an error if it doesn't have a JWT token.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			await sutEditInfoUserCase.edit("", {
				userMoreInfo: {
					city: "João Pessoa",
				},
			});
			throw new Error("Teste failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.statusCode).toBe(401);
			expect(error.message).toBe("Token JWT obrigatório.");
		}

		expect(spyJwt).not.toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("should throw an error if the JWT token is invalid or expired.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			await sutEditInfoUserCase.edit("Toke_Invalid", {
				userMoreInfo: {
					city: "João Pessoa",
				},
			});
			throw new Error("Teste failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.statusCode).toBe(401);
			expect(error.message).toBeDefined();
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("it should throw an error if the new email already exists.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				email: "gabriel@gmail.com",
			});
			throw new Error("Teste failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.statusCode).toBe(409);
			expect(error.message).toBe(
				"Já existe um usuário cadastrado com esse email.",
			);
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("should throw an error with the cell phone number not following the regex pattern.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				userMoreInfo: { phone: "982715054" },
			});
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Esse número de celular não é valido.");
			expect(error.statusCode).toBe(406);
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("should throw an error if the zip code doesn't follow the regex pattern.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				userMoreInfo: { zipCode: "cep_invalido" },
			});
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Cep invalido.");
			expect(error.statusCode).toBe(406);
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});

	it("Should throw one in case the email doesn't follow the correct pattern.", async () => {
		const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwt = vi.spyOn(jwt, "getToken");

		try {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await sutEditInfoUserCase.edit(resUserLogin!.token!, {
				email: "email_invalido",
			});
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Email invalido.");
			expect(error.statusCode).toBe(406);
		}

		expect(spyJwt).toHaveBeenCalledOnce();
		expect(spyBcrypt).not.toHaveBeenCalledOnce();

		expect.assertions(5);
	});
});
