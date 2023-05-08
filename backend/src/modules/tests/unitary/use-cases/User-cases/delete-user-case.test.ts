import { expect, describe, it, vi } from "vitest";

import { usersDbMock } from "../../../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../../../repositories-in-memory/User-repository-in-memory";
import { DeleteUserCase } from "../../../../use-cases/User-cases/Delete-user-case";
import { UserError } from "../../../../errors/User-error";

const sutFactory = () => {
	const userRepository = new UserRepositoryInMemory();
	const sutDeleteUserCase = new DeleteUserCase(userRepository);

	return {
		sutDeleteUserCase,
	};
};

describe("Test in the file delete-user-case", () => {
	const { sutDeleteUserCase } = sutFactory();

	it("should delete the user without throwing errors.", async () => {
		const result = await sutDeleteUserCase.delete({ idUser: "12345678" });

		expect(result).toEqual({
			statusCode: 200,
			message: "Usuário deletado com sucesso.",
		});
		expect(usersDbMock).toHaveLength(2);

		expect.assertions(2);
	});

	it("should throw an error if the user doesn't exist.", async () => {
		try {
			await sutDeleteUserCase.delete({ idUser: "id_not_exist" });
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.message).toBe("Usuário não encontrado.");
      expect(error.statusCode).toBe(404);
    }

    expect(usersDbMock).toHaveLength(2);

    expect.assertions(4);
	});
});
