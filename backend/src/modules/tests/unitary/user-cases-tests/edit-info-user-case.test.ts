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
        city: "Edite Cidade Teste"
      }
    });

    expect(result).toEqual({
      statusCode: 200,
      message: "Informações editadas com sucesso.",
    });
    expect(user?.name).toBe("Edit Test");
    expect(user?.userMoreInfo?.city).toBe("Edite Cidade Teste");
    expect(spyBcrypt).not.toHaveBeenCalledOnce();
    expect(spyJwt).toHaveBeenCalledOnce();

    expect.assertions(5);
	});
});
