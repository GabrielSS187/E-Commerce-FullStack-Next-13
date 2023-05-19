import { expect, describe, it, Mocked, vi } from "vitest";

import { usersDbMock } from "../../../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../../../repositories-in-memory/User-repository-in-memory";
import { DeleteUserCase } from "../../../../use-cases/User-cases/Delete-user-case";
import { AwsS3Adapter } from "../../../../../infra/adapters/AwsS3-adapter/AwsS3-adapter";
import { UserError } from "../../../../errors/User-error";

const sutFactory = () => {
	const awsS3: Mocked<AwsS3Adapter> = {
		deleteFile: vi.fn().mockResolvedValue(true),
		saveFile: vi.fn().mockResolvedValue(true),
		getFile: vi.fn().mockResolvedValue(true),
	} as unknown as Mocked<AwsS3Adapter>;

	const userRepository = new UserRepositoryInMemory();
	const sutDeleteUserCase = new DeleteUserCase(userRepository, awsS3);

	return {
		sutDeleteUserCase,
		awsS3,
	};
};

describe("Test in the file delete-user-case", () => {
	const { sutDeleteUserCase, awsS3 } = sutFactory();

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
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe("Usuário não encontrado.");
			expect(error.statusCode).toBe(404);
		}

		expect(usersDbMock).toHaveLength(2);

		expect.assertions(4);
	});
});
