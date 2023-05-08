import { expect, describe, it } from "vitest";

import { usersDbMock } from "../../../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../../../repositories-in-memory/User-repository-in-memory";
import { FindUserByTokenCase } from "../../../../use-cases/User-cases/Find-user-by-token-case";
import { UserError } from "../../../../errors/User-error";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	const sutFindUserByToken = new FindUserByTokenCase(
		userRepositoryInMemory,
	);

	return {
		sutFindUserByToken,
	};
};

describe("Test in the file Find-user-by-token", () => {
	const {
		sutFindUserByToken,
	} = sutFactory();

	it("should return a user if the JWT token is correct.", async () => {
		const result = await sutFindUserByToken.find({
			userId: "12345678",
		});
		const searchNewUser = usersDbMock.find(
			(user) => user._id === "12345678",
		);

		expect(result).toEqual({
			statusCode: 200,
			user: searchNewUser,
		});
		expect(result?.user).toEqual(searchNewUser);

		expect.assertions(2);
	});

	it("should throw an error if the user does not exist.", async () => {
		try {
			await sutFindUserByToken.find({ userId: "id_not_exist" });
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Usuário não encontrado.");
			expect(error.statusCode).toBe(404);
		}

		expect.assertions(3);
	});
});
