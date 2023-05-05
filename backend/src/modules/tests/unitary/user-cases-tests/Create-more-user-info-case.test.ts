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
		phone: "83986785354",
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
});
