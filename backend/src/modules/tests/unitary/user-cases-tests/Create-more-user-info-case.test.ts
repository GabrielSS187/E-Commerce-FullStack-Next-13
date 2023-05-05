import { expect, describe, it, vi } from "vitest";

import { usersDbMock } from "../../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../../repositories-in-memory/User-repository-in-memory";
import { CreateMoreUserInfoCase } from "../../../use-cases/User-cases/Create-more-user-info-case";
import { UserError } from "../../../errors/User-error";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();

	const sutCreateMoreUserInfoCase = new CreateMoreUserInfoCase(
		userRepositoryInMemory,
	);

	return {
		sutCreateMoreUserInfoCase,
	};
};

describe("Test in the file Create-more-user-info-case.", () => {
	const { sutCreateMoreUserInfoCase } = sutFactory();

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newInfo: any = {
		userId: "123475777432",
		address: "Rua test, 123",
		city: "Cidade Test",
		country: "BR",
		phone: "83982715054",
		state: "SP",
		zipCode: "55555555",
	};

	it("should create more user information without generating errors.", async () => {
		const result = await sutCreateMoreUserInfoCase.create(newInfo);
		const user = usersDbMock.find((user) => user._id === newInfo.userId);

		expect(result).toEqual({
			statusCode: 201,
			message: "Criado com sucesso.",
		});
		expect(user?.userMoreInfo).toBeDefined();
		expect(user?.userMoreInfo).toHaveProperty("_id");

		expect.assertions(3);
	});

	it("should throw an error if the user does not exist.", async () => {
		newInfo["userId"] = "not_found";

		try {
			await sutCreateMoreUserInfoCase.create(newInfo);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Usuário não encontrado.");
			expect(error.statusCode).toBe(404);
		}

		expect.assertions(3);
	});

	it("should throw an error with the cell phone number not following the regex pattern.", async () => {
		newInfo["userId"] = "6468939939009";
		newInfo["phone"] = "982715054";

		const user = usersDbMock.find((user) => user._id === newInfo.userId);

		try {
			await sutCreateMoreUserInfoCase.create(newInfo);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Esse número de celular não é valido.");
			expect(error.statusCode).toBe(406);
		}

		expect(user?.userMoreInfo).toBeUndefined();

		expect.assertions(4);
	});

	it("should throw an error if the zip code doesn't follow the regex pattern.", async () => {
		newInfo["userId"] = "6468939939009";
		newInfo["phone"] = "83982715054";
		newInfo["zipCode"] = "123456789";

		const user = usersDbMock.find((user) => user._id === newInfo.userId);

		try {
			await sutCreateMoreUserInfoCase.create(newInfo);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Cep invalido.");
			expect(error.statusCode).toBe(406);
		}

		expect(user?.userMoreInfo).toBeUndefined();

		expect.assertions(4);
	});

	it("should throw an error if the state or country are greater than 2 characters.", async () => {
		newInfo["state"] = "ABC";
		newInfo["zipCode"] = "55555555";

		const user = usersDbMock.find((user) => user._id === newInfo.userId);

		try {
			await sutCreateMoreUserInfoCase.create(newInfo);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Estado o máximo de caracteres é 2.");
			expect(error.statusCode).toBe(406);
		}

		expect(user?.userMoreInfo).toBeUndefined();

		expect.assertions(4);
	});

	it("should throw an error if the address, city, state and country are less than 2 characters.", async () => {
		newInfo["country"] = "Z";
		newInfo["state"] = "AB";

		const user = usersDbMock.find((user) => user._id === newInfo.userId);

		try {
			await sutCreateMoreUserInfoCase.create(newInfo);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("País o mínimo de caracteres é 2.");
			expect(error.statusCode).toBe(406);
		}

		expect(user?.userMoreInfo).toBeUndefined();

		expect.assertions(4);
	});

	it.skip("should throw an error if any property is missing.", async () => {});
});
